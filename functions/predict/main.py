import base64


def predict(event, context):
    print(context)
    payload = event['data']
    decoded_payload = base64.b64decode(payload)
    print(decoded_payload)
