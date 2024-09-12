import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../../utils/axios';

import { fetchTracks, fetchRecentTracks, fetchMoreTracks} from './libraryActions';

import Playlist from '../tracksTable/playlistTable/playlistTable';
import Header from '../tracksHeader/tracksHeader';
import Spinner from '../../../components/spinner/spinner';

import withStatus from '../../../hoc/statusHoc';

const TracksList = ({ recently, pauseTrack, playing, currentTrack }) => {
  const dispatch = useDispatch();
  const tracks= useSelector((state) => state.libraryReducer.tracks?.items || []);
  const fetching = useSelector((state) => state.libraryReducer.fetchTracksPending);
  const next = useSelector((state) => state.libraryReducer.tracks?.next || false);
  const accessToken = useSelector((state) => state.tokenReducer.token);

  useEffect(() => {
    fetchTracksList();
  }, [recently]);

  const fetchTracksList = () => {
    if (recently) {
      dispatch(fetchRecentTracks());
    } else {
      dispatch(fetchTracks());
    }
  };

  const playTracks = async (context, offset) => {
    const tracks = tracks.slice(offset).map((s) => s.track.uri);
    try {
      await axios.put('/me/player/play', { uris: tracks }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error("Error playing tracks:", error);
    }
  };

  return (
    <Spinner section loading={fetching}>
      <div className="player-container">
        <Header
          title={recently ? 'Recently Played' : 'Tracks'}
          playTrack={() => playTracks(tracks, 0)}
          pauseTrack={pauseTrack}
          playing={playing}
        />
        <Playlist
          tracks={tracks}
          playTrack={playTracks}
          pauseTrack={pauseTrack}
          current={currentTrack}
          playing={playing}
          more={!!next}
          fetchMoreTracks={() => dispatch(fetchMoreTracks())}
        />
      </div>
    </Spinner>
  );
};

export default withStatus(TracksList);
