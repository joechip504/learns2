from s2protocol import versions
from mpyq import MPQArchive
import os


class SC2ReplayParser(object):
    def __init__(self, replay):
        assert os.path.isfile(replay), f'{replay} is not a file'
        self.archive = MPQArchive(replay)
        self.protocol = self.get_protocol(self.archive)

    @staticmethod
    def get_protocol(archive: MPQArchive):
        content = archive.header['user_data_header']['content']
        header = versions.latest().decode_replay_header(content)
        base_build = header['m_version']['m_baseBuild']
        return versions.build(base_build)
