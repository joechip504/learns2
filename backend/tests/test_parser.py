from learns2.parser import SC2ReplayParser

def test_return_hello():
    parser = SC2ReplayParser()
    assert parser.return_hello() == 'hello'
