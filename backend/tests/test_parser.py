from learns2.parser import SC2ReplayParser

from pathlib import Path
from collections import defaultdict

resources = Path(__file__).absolute().parent.joinpath('resources')
everdream = resources.joinpath('EverDream.SC2Replay')
spainvukraine = resources.joinpath('SpainVsUkraine.SC2Replay')


def test_proto_81433():
    parser = SC2ReplayParser(everdream)
    assert "protocol81433" in str(parser.protocol)


def test_ladder_1v1_81433_details():
    parser = SC2ReplayParser(everdream)
    details = parser.to_dict()['details']
    assert details['m_title'] == 'Ever Dream LE'
    assert details['m_isBlizzardMap']
    assert details['m_mapSizeX'] == 200
    assert details['m_mapSizeY'] == 216
    assert details['m_timeUTC'] == 132436435995866825


def test_ladder_1v1_81433_players():
    parser = SC2ReplayParser(everdream)
    players = parser.to_dict()['players']
    assert len(players) == 2
    p0, p1 = players[0], players[1]
    assert p0['m_userInitialData']['m_name'] == 'GamIsSecHome'
    assert p1['m_userInitialData']['m_name'] == 'Jobama'
    assert p0['m_userId'] == 0
    assert p1['m_userId'] == 1
    assert p0['m_race'] == 'Protoss'
    assert p1['m_race'] == 'Protoss'

    # https://starcraft2.com/en-us/profile/1/1/2501022
    assert p1['m_localizedId'] == '1/1/2501022'


def test_ladder_1v1_81433_events():
    parser = SC2ReplayParser(everdream)
    events = parser.events()
    assert len(events) == 2965
    hotkeys = defaultdict(int)
    for e in events:
        if e['_event'] == 'NNet.Game.SControlGroupUpdateEvent' and e['_userid']['m_userId'] == 1:
            hotkeys[e['m_controlGroupIndex']] += 1
    assert hotkeys[1] == 125
    assert hotkeys[4] == 37
    assert hotkeys[5] == 159

def test_1v1_decode_err():
    parser = SC2ReplayParser(spainvukraine)
    players = parser.to_dict()['players']
    assert len(players) == 2
