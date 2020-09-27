# https://firebase.google.com/docs/hosting/functions

from flask import Request


def ping(req: Request):
    return 'Pong!'
