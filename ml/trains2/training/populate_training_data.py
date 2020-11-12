import datetime
import io
import logging
import os
import sqlite3
from argparse import ArgumentParser

from google.cloud import firestore, storage

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)


def max_timestamp(sqlite_db: str, replay_table: str):
    sql = f'SELECT max(timestamp) FROM {replay_table}'
    conn = sqlite3.connect(sqlite_db)
    with conn:
        rs = conn.execute(sql)
        result = rs.fetchone()
    conn.close()
    return datetime.datetime.fromisoformat(result[0]) if result and result[0] else None


def get_all_cached_players(sqlite_db: str, player_table: str):
    sql = f'SELECT * FROM {player_table}'
    conn = sqlite3.connect(sqlite_db)
    conn.row_factory = sqlite3.Row
    rs = conn.execute(sql)
    results = list(rs.fetchall())
    conn.close()
    return results


def reload_all_players(sqlite_db: str, player_table: str):
    client = firestore.Client()
    firestore_query = client.collection('players')
    sql = f'INSERT OR REPLACE INTO {player_table} VALUES (?, ?, ?)'
    conn = sqlite3.connect(sqlite_db)
    with conn:
        for snapshot in firestore_query.get():
            data = snapshot.to_dict()
            params = (snapshot.id, data.get('name'), data.get('url'))
            log.info(params)
            conn.execute(sql, params)
    conn.close()


def download_replay(uri: str):
    log.info(f'downloading {uri}')
    gcs_client = storage.Client()
    buf = io.BytesIO()
    gcs_client.download_blob_to_file(uri, buf)
    buf.seek(0)
    bytebuf = buf.read()
    buf.close()
    return bytebuf


def reload_all_replays(sqlite_db: str, replay_table: str):
    firestore_client = firestore.Client()
    sql = f'INSERT OR REPLACE INTO {replay_table} VALUES (?, ?, ?, ?, ?)'
    ts = max_timestamp(sqlite_db, replay_table)
    firestore_query = firestore_client.collection('tournamentReplays').where('isLabeled', '==', True)
    if ts:
        firestore_query = firestore_query.where('timestamp', '>', ts)
    for snapshot in firestore_query.get():
        conn = sqlite3.connect(sqlite_db)
        snap = snapshot.to_dict()
        event = snap['storageEvent']
        bucket = event['bucket']
        path = event['name']
        uri = f'gs://{bucket}/{path}'
        blob = download_replay(uri)
        checksum = event['md5Hash']
        labels = snap['labels']
        for player_id, player_user_id in labels.items():
            with conn:
                player_doc_id = player_id.replace('player_', '')
                params = (checksum, player_doc_id, player_user_id, snap['timestamp'].isoformat(), sqlite3.Binary(blob))
                log.info(f'Inserting for checksum={checksum}, docid={player_doc_id}')
                conn.execute(sql, params)
        conn.close()


def bootstrap():
    parser = ArgumentParser()
    parser.add_argument('-credentials', help='/path/to/gcp/credentials.json')
    parser.add_argument('-db', help='/path/to/sqlite/file.db')
    parser.add_argument('--player_table', help='name of player table', default='player')
    parser.add_argument('--replay_table', help='name of replay table', default='replay')
    parser.print_help()
    args = parser.parse_args()
    assert os.path.isfile(args.credentials), f'{args.credentials} must be a regular file'
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = args.credentials
    return args


def main():
    args = bootstrap()
    reload_all_players(args.db, args.player_table)
    reload_all_replays(args.db, args.replay_table)


if __name__ == '__main__':
    main()
