# https://firebase.google.com/docs/hosting/functions
# https://github.com/GoogleCloudPlatform/functions-framework-python

import os
import json
from io import BytesIO
from google.cloud import storage, firestore, pubsub_v1
from learns2.parser import SC2ReplayParser
from flask import Request, jsonify
from zipfile import ZipFile
from slugify import slugify
from uuid import uuid4


USER_REPLAY_BUCKET = 'learns2-user-replays'
USER_REPLAY_ANALYSIS_TOPIC = 'learns2-user-replay-analysis'
USER_REPLAY_COLLECTION = 'replaysForAnalysis'

def ping(req: Request):
    return 'Pong!'


# https://firebase.google.com/docs/auth/admin/verify-id-tokens#web
# https://firebase.google.com/docs/admin/migrate-python-v3
def replay_info(req: Request):
    replay = req.files['replay']
    replay = BytesIO(replay.read())
    parser = SC2ReplayParser(replay)
    payload = parser.to_dict()
    return jsonify(payload)


def user_upload_replay(req: Request):
    # Parse the replay
    replay = req.files['replay']
    buf = BytesIO(replay.read())
    parser = SC2ReplayParser(buf)
    replay_dict = parser.to_dict()

    # If the replay is a valid sc2 replay, store it in cloud storage
    blob_name = f'{uuid4()}.SC2Replay'
    buf.seek(0)
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(USER_REPLAY_BUCKET)
    blob = bucket.blob(blob_name)
    blob.upload_from_file(buf)

    # Add metadata
    replay_dict['timestamp'] = firestore.SERVER_TIMESTAMP
    replay_dict['blob_uri'] = f'gs://{USER_REPLAY_BUCKET}/{blob_name}'

    # Write to firestore
    db = firestore.Client()
    ref: firestore.CollectionReference = db.collection(USER_REPLAY_COLLECTION)
    update_time, doc = ref.add(replay_dict)

    # Put this replay in the analysis queue
    payload = {
        'gcs_uri': replay_dict['blob_uri'],
        'firestore_doc_path': doc.path
    }
    publisher = pubsub_v1.PublisherClient()
    topic_name = f'projects/learns2/topics/{USER_REPLAY_ANALYSIS_TOPIC}'
    encoded_payload = json.dumps(payload).encode('utf-8')
    fut = publisher.publish(topic_name, encoded_payload)
    print(fut.result())

    # http response
    resp = {
        'ok': True,
        'path': doc.path
    }

    return jsonify(resp), 202


# https://cloud.google.com/storage/docs/json_api/v1/objects#resource
def parse_tournament_replay(event, context):
    filename = event['name']
    slug = slugify(filename)
    localfile = f'/tmp/{slug}'
    if filename.endswith('.SC2Replay'):
        print(f"Processing file: {filename} (slug={slug})")
        bucketname = event['bucket']
        client = storage.Client()
        bucket = client.get_bucket(bucketname)
        blob = bucket.get_blob(filename)
        blob.download_to_filename(localfile)
        try:
            parser = SC2ReplayParser(localfile)
            payload = parser.to_dict()
            payload['storageEvent'] = event
            payload['timestamp'] = firestore.SERVER_TIMESTAMP
            db = firestore.Client()
            ref = db.collection("tournamentReplays")
            # TODO this should be in a transaction
            res = ref.where("storage_event.md5Hash", "==", event["md5Hash"]).limit(1).get()
            if len(res) == 0:
                ref = db.collection('tournamentReplays').add(payload)
            else:
                print(f'replay with checksum {event["md5Hash"]} is already indexed. Skipping.')
        finally:
            if os.path.exists(localfile):
                os.remove(localfile)


def unzip_replays(event, context):
    filename = event['name']
    slug = slugify(filename)
    localfile = f'/tmp/{slug}'
    if filename.endswith('.zip'):
        print(f'Expanding zip file {filename}')
        client = storage.Client()
        bucketname = event['bucket']
        bucket = client.get_bucket(bucketname)
        blob = bucket.get_blob(filename)
        blob.download_to_filename(localfile)
        try:
            with ZipFile(localfile, 'r') as zf:
                for info in zf.infolist():
                    if info.filename.endswith('.SC2Replay'):
                        print(f'Processing archived file {info.filename}')
                        with zf.open(info) as content:
                            folder = slug.replace('.zip', '')
                            destfilename = slugify(info.filename)
                            tgtblob = bucket.blob(f'{folder}/{destfilename}_{info.CRC}.SC2Replay')
                            tgtblob.upload_from_file(content)
                    else:
                        print(f'Skipping {info.filename}')
        finally:
            if os.path.exists(localfile):
                os.remove(localfile)
            # remove the original zip file to save some space
            blob.delete()


def to_player(payload):
    player = {}
    for key, value in payload['fields'].items():
        player[key] = value.get('stringValue')
    uid = payload.get('name')
    if uid:
        player['id'] = uid.split('/')[-1]
    return player


# https://cloud.google.com/functions/docs/calling/cloud-firestore#functions_firebase_firestore-python
# https://cloud.google.com/firestore/docs/manage-data/add-data#python_11
def update_player_cache(data, context):
    """Maintains document /caches/allPlayers by reacting to any write in the 'players' collection.

    :param data: event data
    :param context: event context
    :return: None
    """
    print('data')
    print(data)
    print('context')
    print(context)
    old = data['oldValue']
    new = data['value']
    db = firestore.Client()
    ref: firestore.DocumentReference = db.collection('caches').document('allPlayers')
    batch: firestore.WriteBatch = db.batch()
    if old and old.get('fields'):
        old_player = to_player(old)
        batch.update(ref, {'objects': firestore.ArrayRemove([old_player])})
    new_player = to_player(new)
    batch.update(ref, {'objects': firestore.ArrayUnion([new_player])})
    print('new player:', new_player)
    batch.commit()
