from learns2.parser import SC2ReplayParser

from pathlib import Path

resources = Path(__file__).absolute().parent.joinpath('resources')
everdream = resources.joinpath('EverDream.SC2Replay')


def test_proto_81433():
    parser = SC2ReplayParser(everdream)
    assert "protocol81433" in str(parser.protocol)


def test_ladder_1v1_81433():
    parser = SC2ReplayParser(everdream)
    payload = parser.to_dict()
    details = payload['details']
    players = payload['players']
    assert len(players) == 2
    p0, p1 = players[0], players[1]
    assert details['m_title'].decode('utf-8') == 'Ever Dream LE'
    assert details['m_isBlizzardMap']
    assert details['m_mapSizeX'] == 200
    assert details['m_mapSizeY'] == 216
    assert details['m_timeUTC'] == 132436435995866825
    assert p0['m_userInitialData']['m_name'].decode('utf-8') == 'GamIsSecHome'
    assert p1['m_userInitialData']['m_name'].decode('utf-8') == 'Jobama'
    assert p0['m_userId'] == 0
    assert p1['m_userId'] == 1
    assert p0['m_race'].decode('utf-8') == 'Protoss'
    assert p1['m_race'].decode('utf-8') == 'Protoss'
