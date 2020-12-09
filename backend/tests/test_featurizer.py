from pathlib import Path

from learns2.featurizer import SC2ReplayFeaturizer, preprocess

resources = Path(__file__).absolute().parent.joinpath('resources')
everdream = resources.joinpath('EverDream.SC2Replay')


def test_all_frames():
    frames = preprocess(everdream, 1000)[1]
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


def test_selection():
    f = SC2ReplayFeaturizer(everdream, user_id=1, num_frames=5000, num_camera_hotspots=5)
    selections = f.selection_feature()
    assert len(selections) == 5000
    nonempty = [s for s in selections if s[0] > 0]
    assert len(nonempty) == 90


def test_target():
    f = SC2ReplayFeaturizer(everdream, user_id=1, num_frames=5000, num_camera_hotspots=5)
    targets = f.target_feature()
    assert len(targets) == 5000
    nonempty = [xs for xs in targets if xs[0] > 0 or xs[1] > 0]
    assert len(nonempty) == 111


def test_races():
    f = SC2ReplayFeaturizer(everdream, user_id=1, num_frames=5000, num_camera_hotspots=5)
    targets = f.races_feature()
    assert len(targets) == 5000
    assert targets[0] == [1, 0, 0]


def test_feature():
    f = SC2ReplayFeaturizer(everdream, user_id=1, num_frames=5000, num_camera_hotspots=5)
    feature = f.feature()
    assert len(feature) == 5000
    assert f.feature_shape() == feature.shape
    for xs in feature:
        assert len(xs) == 22


def test_event_ratio():
    f = SC2ReplayFeaturizer(everdream, user_id=1, num_frames=99999, num_camera_hotspots=5)
    from collections import defaultdict
    d = defaultdict(int)
    for xs in f.frames:
        for event in xs:
            if event['_userid']['m_userId'] == 1:
                d[event['_event']] += 1
    from pprint import pprint
    pprint(d)
