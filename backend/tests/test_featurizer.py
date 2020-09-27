from pathlib import Path

from learns2.featurizer import SC2ReplayFeaturizer

resources = Path(__file__).absolute().parent.joinpath('resources')
everdream = resources.joinpath('EverDream.SC2Replay')


def test_frames():
    f = SC2ReplayFeaturizer(everdream)
    frames = f.frames(1000)
    assert len(frames) == 1000
    empty_frames = [frame for frame in frames if len(frame) == 0]
    assert len(empty_frames) == 617
