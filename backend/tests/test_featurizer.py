from pathlib import Path

from learns2.featurizer import SC2ReplayFeaturizer, get_all_frames

resources = Path(__file__).absolute().parent.joinpath('resources')
everdream = resources.joinpath('EverDream.SC2Replay')


def test_all_frames():
    frames = get_all_frames(everdream, 1000)
    assert len(frames) == 1000
    empty_frames = [frame for frame in frames if len(frame) == 0]
    assert len(empty_frames) == 617


def test_hotspots():
    f = SC2ReplayFeaturizer(everdream, user_id=0, num_frames=5000, num_camera_hotspots=5)
    hotspots = f.camera_hotspots_feature()
    assert len(hotspots) == 5000
    for hotspot in hotspots:
        assert len(hotspot) == 5
        for value in hotspot:
            assert (value == 0 or value == 1)
    visited = [h for h in hotspots if h[0] == 1]
    assert len(visited) == 58

def test_hotkey():
    f = SC2ReplayFeaturizer(everdream, user_id=1, num_frames=5000, num_camera_hotspots=5)
    hotkeys = f.hotkey_feature()
    assert len(hotkeys) == 5000
    for hotkey in hotkeys:
        assert len(hotkey) == 10
        for value in hotkey:
            assert (value == 0 or value == 1)
    pressed_one = [h for h in hotkeys if h[1] == 1]
    assert len(pressed_one) == 111