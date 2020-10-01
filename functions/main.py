# https://firebase.google.com/docs/hosting/functions

from io import BytesIO
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