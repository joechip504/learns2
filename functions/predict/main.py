import base64
import io
import json
import shutil

import numpy as np
from google.cloud import storage, firestore
from learns2.featurizer import SC2ReplayFeaturizer
from learns2.parser import SC2ReplayParser
from tensorflow import keras

# copy/paste this from the training output
PROTOCOL = {'knobs': {'batch_size': 512,
                      'dropout': 0.4,
                      'num_camera_hotspots': 3,
                      'num_epochs': 1000,
                      'num_frames': 2500,
                      'pct_validate': 0.2,
                      'recurrent_dropout': 0.0,
                      'stop_after': 0},
            'model_uri': 'gs://learns2-models/20210103-115111-9945/model.zip',
            'players_one_hot': {'1c03Nd9vyuqfbFiO0I0e': 0,
                                '2hXDE33IJjvEuNKdyQZs': 1,
                                '3Af6Fl2OMtXFszvmG5h0': 2,
                                '3B6U9F0qYUDlmonrxll6': 3,
                                '4KUXyRoqNQLWT9v6Yjwa': 4,
                                '4VkqBUa5XmjMKx25hqMU': 5,
                                '5Rcw1RJ9pevKVKIJnKpv': 6,
                                '5m9c1OqF4UxFn3dXXzzs': 7,
                                '6BajxsL31gO4mqmRZOw4': 8,
                                '855CeBkAWCfyGbzAz8TH': 9,
                                '8JWrhWMc6TFTUaq7vwm3': 10,
                                '9pkEsRZtle8OezecPyks': 11,
                                'BGXOlDRHxKU0UE3DgBFe': 12,
                                'BMDFQmM6oucqsFPBbPo8': 13,
                                'BeInzdDecjdOp0WzDaxh': 14,
                                'CWiQwkv3gyAuDAxHlHjN': 15,
                                'CmdXvMvkGyJEEW6orcBl': 16,
                                'CntL0QJkFIHxK77CjQg2': 17,
                                'DX69dXNab3FrNJy0Xic0': 18,
                                'E2Qmd59rl36ZHusuUziq': 19,
                                'EcGvIRgrsz1BxvW5iAuj': 20,
                                'F7SWyako0y3avWtVpN7h': 21,
                                'FGv64qsm2JOHN5KYlvPs': 22,
                                'IEW7zbvcAd8jTXYKX5Bd': 23,
                                'KQjOMcQqXxe4uhXlPd8Z': 24,
                                'P6Y3tTVkAkFftAH5afgI': 25,
                                'Ps4CxhVx7iini8UWeCcN': 26,
                                'SxhuShQmhBSQDEeG10JV': 27,
                                'TDdsHypdZkOZDtR0zr4v': 28,
                                'ZzXWf8pQWClNVBa1uGfx': 29,
                                'aZLrWPTCEvCPYZnvCTf4': 30,
                                'bEjVfOYqc2JxqTWKSVsS': 31,
                                'd6bi4zBmhTndcPcICQj3': 32,
                                'dINg29MAHXiexU0zYT9q': 33,
                                'dmlbVpH86JLZSEamGSTw': 34,
                                'eBuGk7xUPRIigff4diQS': 35,
                                'f0tAeP7ByTjGSySJAcrx': 36,
                                'g0kzxg18EOlPkAZhLi0R': 37,
                                'hGtOFiWzgIWkqLclHJAK': 38,
                                'iatFgS200BbbQuf6Sh1x': 39,
                                'jFIAI7mIFzAXhGFiqR2y': 40,
                                'jfb3iKBSiMhRahzeNxD6': 41,
                                'kEIrBrhW3SdQ5AGEr5X3': 42,
                                'l6p32wQTcmS7DwqrOeGg': 43,
                                'lDnRA4KpOy9DZaFEvG51': 44,
                                'mfS3zhzphxbUGKbblJFf': 45,
                                'nTwQIHJcQUtc1cqLfVPO': 46,
                                'oZvnWaVCead6r2ri1Sal': 47,
                                'ptNv7OK8RxtE8bIOkdWQ': 48,
                                'qaQEgkTjCDxJSchjRYFs': 49,
                                'rz9Yb9FPQZuwRYWdZgcI': 50,
                                'sepwnA8cLL0zk59jxJ0t': 51,
                                'tIOihYyh45tBhLALBCt0': 52,
                                'uASCD0YTLvmdZtMQjury': 53,
                                'uZBMyTImSlXVxsC5GXUo': 54,
                                'wNCtpOHqBx7WJWeJ7ZJ2': 55,
                                'wTNQ73zhZaupaC4k08qE': 56,
                                'wUD0QJALU0mbkR1Ah5n9': 57,
                                'x0l1dH85Hg6cIh8RKIgN': 58,
                                'xgJIh2cKsJaEB1ug93gY': 59,
                                'yymoObX8cbI9fdm5J1jA': 60}}

PLAYER_LOOKUP = dict([(val, key) for key, val in PROTOCOL['players_one_hot'].items()])
LOCAL_MODEL_PATH = '/tmp/model'

# Lazily initialized
storage_client = None
firestore_client = None
model = None


def predict(event, context):
    global firestore_client, storage_client, model

    if storage_client is None:
        storage_client = storage.Client()

    if firestore_client is None:
        firestore_client = firestore.Client()

    if model is None:
        print('Initializing model')
        with open('/tmp/model.zip', 'wb') as file_obj:
            storage_client.download_blob_to_file(PROTOCOL['model_uri'], file_obj)
        shutil.unpack_archive('/tmp/model.zip', '/tmp')
        model = keras.models.load_model(LOCAL_MODEL_PATH, compile=True)

    print(context)
    payload = json.loads(base64.b64decode(event['data']))
    print(payload)

    # Download the replay
    gcs_uri, firestore_doc_path = payload['gcs_uri'], payload['firestore_doc_path']
    replay_buf = io.BytesIO()
    storage_client.download_blob_to_file(gcs_uri, replay_buf)
    replay_buf.seek(0)

    # Extract players
    players = SC2ReplayParser(replay=replay_buf).players()
    replay_buf.seek(0)

    # Run analysis for each player
    predictions = []
    for player in players:
        name, user_id = player['m_name'], player['m_userId']
        print(f'Running analysis for player={name}, userId={user_id}')
        try:
            feature = SC2ReplayFeaturizer(
                replay=replay_buf,
                user_id=user_id,
                num_frames=PROTOCOL['knobs']['num_frames'],
                num_camera_hotspots=PROTOCOL['knobs']['num_camera_hotspots']
            ).feature()
            wrapped_feature = np.empty([1] + list(feature.shape))
            wrapped_feature[0] = feature
            prediction = model.predict(wrapped_feature)[0]
            offset = prediction.argmax(axis=-1)
            guess = PLAYER_LOOKUP[offset]
            confidence = prediction[offset].item()
            print(f'Guess: player={guess}, confidence={confidence * 100}')
            predictions.append({
                'player_user_id': user_id,
                'player_doc_id': guess,
                'confidence': confidence
            })
        # Replay might not have enough events
        except Exception as e:
            import logging
            logging.warning(e)
        finally:
            replay_buf.seek(0)

    # Finally, write analysis results back to firestore
    analysis = {
        'status': 'FINISHED',
        'timestamp': firestore.SERVER_TIMESTAMP,
        'predictions': predictions
    }
    ref: firestore.DocumentReference = firestore_client.document(firestore_doc_path)
    ref.set({'analysis': analysis}, merge=True)
