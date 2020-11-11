# https://firebase.google.com/docs/hosting/functions

import os
from io import BytesIO
from google.cloud import storage, firestore
from learns2.parser import SC2ReplayParser
from flask import Request, jsonify
from zipfile import ZipFile
from slugify import slugify


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
