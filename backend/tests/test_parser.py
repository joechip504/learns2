from learns2.parser import SC2ReplayParser

from pathlib import Path

resources = Path(__file__).absolute().parent.joinpath('resources')


def test_proto_81433():
    replay = resources.joinpath('EverDream.SC2Replay')
    parser = SC2ReplayParser(replay)
    assert "protocol81433" in str(parser.protocol)
