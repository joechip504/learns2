import tensorflow as tf

gpu_devices = tf.config.experimental.list_physical_devices('GPU')
for device in gpu_devices: tf.config.experimental.set_memory_growth(device, True)

import logging
import sqlite3
from argparse import ArgumentParser
from copy import deepcopy
from dataclasses import dataclass
from io import BytesIO

import numpy as np
from sklearn.model_selection import train_test_split
from tensorflow import keras
from tensorflow.keras.layers import Bidirectional, LSTM, Dense, Embedding, Flatten, GRU
from tensorflow.keras import activations

from learns2.featurizer import SC2ReplayFeaturizer

logging.basicConfig(
    format="%(asctime)s %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S%z",
    level=logging.INFO
)
log = logging.getLogger(__name__)


@dataclass
class Knobs(object):
    """Adjust these while training to try and maximize accuracy"""
    dropout: float
    recurrent_dropout: float
    num_epochs: int
    batch_size: int
    pct_validate: float
    num_frames: int  # https://github.com/Blizzard/s2protocol/issues/70#issuecomment-379000527
    num_camera_hotspots: int
    stop_after: int


@dataclass
class DBConf(object):
    path: str
    player_table: str
    replay_table: str


def preprocess(dbconf: DBConf, knobs: Knobs, games_per_player: int):
    """Reads candidate replays from the database and creates features.

    We assume there may be some labeled replays for which we cannot create features (perhaps the game
    ended in 10 seconds, so the shape of the feature would not be consistent). These exceptions are handled
    here.

    The more games we read here, the more it makes sense to cache these results between runs or to at least
    enable multiprocessing.

    :param dbconf: database config
    :param knobs: ml knobs
    :param games_per_player: require at least this many candidate replays to consider this player in the model
    :return: map of player_docid -> list of features
    """
    data, total, shape = {}, 0, None
    conn = sqlite3.connect(dbconf.path)

    # Get the docids of candidate players
    sql0 = f'SELECT player_doc_id, count(*) as c FROM {dbconf.replay_table} GROUP BY (player_doc_id) having c >= {games_per_player}'
    for row in conn.execute(sql0):
        data[row[0]] = []

    # Pull up to games_per_player replays for each player
    sql1 = f'SELECT blob, replay_user_id, replay_id from {dbconf.replay_table} WHERE player_doc_id = (?) ORDER BY random()'
    total = 0
    for player in data.keys():
        candidates = []
        cursor = conn.execute(sql1, [player])
        for row in cursor:
            buf, blob, user_id, replay_id = BytesIO(), row[0], row[1], row[2]
            buf.write(blob)
            buf.seek(0)
            try:
                f = SC2ReplayFeaturizer(
                    replay=buf,
                    user_id=user_id,
                    num_frames=knobs.num_frames,
                    num_camera_hotspots=knobs.num_camera_hotspots
                )
                feature = f.feature()
                candidates.append(feature)
                total += 1
                log.info(f'player={player}, shape={feature.shape}, done={len(candidates)}, total={total}')
                if not shape:
                    shape = feature.shape
            except Exception as e:
                log.warning(f'Skipping {replay_id}: {e}')
                pass
            if len(candidates) >= games_per_player:
                log.info(f'finished preprocessing for player={player}')
                break

        data[player] = deepcopy(candidates)
        if knobs.stop_after != 0:
            if total >= knobs.stop_after:
                data[player] = deepcopy(candidates)
                return data, total, shape

    return data, total, shape


def build_one_hot(preprocessed: dict):
    curr, res = 0, {}
    for pid in preprocessed.keys():
        res[pid] = curr
        curr += 1
    return res


def build_split(preprocessed: dict, players_one_hot: dict, total: int, feature_shape: np.shape, knobs: Knobs):
    """Builds a train/test split from the preprocessed replay data.

    :param preprocessed:
    :param players_one_hot:
    :param total:
    :param feature_shape:
    :param knobs:
    :return:
    """
    label_shape = [total, len(players_one_hot)]
    data_shape = [total] + list(feature_shape)
    log.info(f'data_shape={data_shape} label_shape={label_shape}')
    all_data = np.empty(data_shape)
    all_labels = np.empty(label_shape)
    label_idx = 0
    for player, games in preprocessed.items():
        for feature in games:
            label = np.zeros(len(players_one_hot))
            label[players_one_hot[player]] = 1
            all_labels[label_idx] = label
            all_data[label_idx] = feature
            label_idx += 1

    # https://stackoverflow.com/a/46716676
    # use 'stratify' to ensure a correct train/test split _per player_, not just globally
    return train_test_split(all_data, all_labels, test_size=knobs.pct_validate, stratify=all_labels)


# https://docs.nvidia.com/deeplearning/cudnn/release-notes/rel_8.html#rel-805
# If you get cuda issues on windows, just disable it.
# Hours wasted trying to debug and the answer seems to be don't use windows
def build_model(one_replay_shape: np.shape, one_label_shape: np.shape, knobs: Knobs):
    num_players = one_label_shape[0]
    model = keras.Sequential()
    batch_input_shape = [knobs.batch_size] + list(one_replay_shape)
    hidden_units = 64
    model.add(GRU(hidden_units, input_shape=one_replay_shape, dropout=knobs.dropout))
    model.add(Dense(hidden_units, activation=activations.sigmoid))
    model.add(Dense(num_players, activation=activations.softmax))
    return model


def bootstrap():
    """Parses arguments"""
    parser = ArgumentParser()
    parser.add_argument('-db', help='/path/to/sqlite/file.db')
    parser.add_argument('--games_per_player', help='number of games per player', default=10, type=int)
    parser.add_argument('--player_table', help='name of player table', default='player', type=str)
    parser.add_argument('--replay_table', help='name of replay table', default='replay', type=str)
    parser.add_argument('--pct_validate', help='percent of data to use in validation set. default 20', default=20,
                        type=int)
    parser.add_argument('--pct_dropout', help='model dropout. default 20 percent', default=20, type=int)
    parser.add_argument('--pct_recurrent_dropout', help='model recurrent dropout. default 20', default=20, type=int)
    parser.add_argument('--num_epochs', help='number of epochs', default=300, type=int)
    parser.add_argument('--batch_size', help='batch size. typically power of 2', default=128, type=int)
    parser.add_argument('--num_frames', help='number of frames per replay', default=600, type=int)
    parser.add_argument('--num_camera_hotspots', help='number of frames per replay', default=3, type=int)
    parser.add_argument('--stop_after', help='for quick runs while debugging. 0 to disable', default=0, type=int)
    parser.print_help()
    args = parser.parse_args()
    return args


def main():
    args = bootstrap()
    dbconf = DBConf(args.db, args.player_table, args.replay_table)
    knobs = Knobs(
        dropout=args.pct_dropout / 100,
        recurrent_dropout=args.pct_recurrent_dropout / 100,
        num_epochs=args.num_epochs,
        batch_size=args.batch_size,
        pct_validate=args.pct_validate / 100,
        num_frames=args.num_frames,
        num_camera_hotspots=args.num_camera_hotspots,
        stop_after=args.stop_after
    )
    preprocessed, total, shape = preprocess(dbconf, knobs, args.games_per_player)
    players_one_hot = build_one_hot(preprocessed)
    replay_train, replay_test, label_train, label_test = build_split(preprocessed, players_one_hot, total, shape, knobs)
    model = build_model(replay_train[0].shape, label_train[0].shape, knobs)
    print(model.summary())
    model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
    model.fit(replay_train, label_train, validation_data=(replay_test, label_test), epochs=knobs.num_epochs,
              batch_size=knobs.batch_size, shuffle=True)
    scores = model.evaluate(replay_test, label_test, verbose=0)
    print("Accuracy: %.2f%%" % (scores[1] * 100))


if __name__ == '__main__':
    main()
