import React, { useContext } from 'react';
import { GlobalStateContext } from '../context/GlobalStateContext';
import axios from '../utils/axios';
// import {
//   playSong,
//   pauseSong,
//   playTracks
// } from '../screens/Player/playerActions';
// import {
//   removeSong,
//   addSong,
//   containsSong
// } from '../layout/MainSection/trackList/libraryActions';

export default function withStatus(ComposedComponent) {
  const StatusHoc = (props) => {
    const { state, dispatch } = useContext(GlobalStateContext);

    const playSong = async (track) => {
      try {
        await axios.put('/me/player/play', { uris: [track.uri] });
        dispatch({ type: 'SET_IS_PLAYING', payload: true });
        dispatch({ type: 'SET_CURRENT_TRACK', payload: track });
      } catch (error) {
        console.error('Error playing song:', error);
      }
    };

    const pauseSong = async () => {
      try {
        await axios.put('/me/player/pause');
        dispatch({ type: 'SET_IS_PLAYING', payload: false });
      } catch (error) {
        console.error('Error pausing song:', error);
      }
    };

    const playTracks = async (tracks, offset = 0) => {
      try {
        const track = tracks[offset];
        await axios.put(`/me/player/play`, {
          uris: [track.uri],
        });
        dispatch({ type: 'SET_IS_PLAYING', payload: true });
        dispatch({ type: 'SET_CURRENT_TRACK', payload: track });
      } catch (error) {
        console.error('Error playing tracks:', error);
      }
    };

    const removeSong = async (id) => {
      try {
        await axios.delete(`/me/tracks?ids=${id}`);
        dispatch({ type: 'REMOVE_TRACK_SUCCESS', current: false });
      } catch (error) {
        console.error('Error removing song:', error);
      }
    };

    const addSong = async (id) => {
      try {
        await axios.put(`/me/tracks?ids=${id}`);
        dispatch({ type: 'ADD_TRACK_SUCCESS', current: false });
      } catch (error) {
        console.error('Error adding song:', error);
      }
    };

    const containsSong = async (id) => {
      try {
        const response = await axios.get(`/me/tracks/contains?ids=${id}`);
        return response.data[0];
      } catch (error) {
        console.error('Error checking if song is in library:', error);
      }
    };

    const currentUri = state.player.status ? state.player.status.context.uri : null;
    const currentSong = state.player.status
      ? state.player.status.track_window.current_track.linked_from?.id ||
        state.player.status.track_window.current_track.id
      : null;
    const playing = state.player.status ? !state.player.status.paused : false;

    return (
      <ComposedComponent
        {...props}
        currentUri={currentUri}
        currentSong={currentSong}
        playing={playing}
        playSong={playSong}
        pauseSong={pauseSong}
        playTracks={playTracks}
        removeSong={removeSong}
        addSong={addSong}
        containsSong={containsSong}
      />
    );
  };

  return StatusHoc;
}