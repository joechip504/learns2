# https://firebase.google.com/docs/hosting/functions

from io import BytesIO
from google.cloud import storage, firestore
from learns2.parser import SC2ReplayParser
from flask import Request, jsonify


def ping(req: Request):
    return 'Pong!'


def replay_info(req: Request):
    replay = req.files['replay']
    replay = BytesIO(replay.read())
    parser = SC2ReplayParser(replay)
    payload = parser.to_dict()
    return jsonify(payload)


# https://cloud.google.com/storage/docs/json_api/v1/objects#resource
def parse_tournament_replay(event, context):
    filename = event['name']
    if filename.endswith('.SC2Replay'):
        print(f"Processing file: {filename}.")
        localfile = f'/tmp/{filename}'
        bucketname = event['bucket']
        client = storage.Client()
        bucket = client.get_bucket(bucketname)
        blob = bucket.get_blob(filename)
        blob.download_to_filename(localfile)
        parser = SC2ReplayParser(localfile)
        payload = parser.to_dict()
        payload['storage_event'] = event
        payload['labels'] = {}
        payload['is_labeled'] = False
        db = firestore.Client()
        ref = db.collection("tournamentReplays")
        res = ref.where("storage_event.md5Hash", "==", event["md5Hash"]).limit(1).get()
        if len(res) == 0:
            ref = db.collection('tournamentReplays').add(payload)
        else:
            print(f'replay with checksum {event["md5Hash"]} is already indexed. Skipping.')

