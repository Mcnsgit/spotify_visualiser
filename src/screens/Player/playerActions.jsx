import device from './devices/device';
import instance  from '../../utils/axios';

export const nextTrack = () => async (dispatch, getState) => {
  const { deviceId } = getState().player;
  try {
    await instance.post(`https://api.spotify.com/v1/me/player/next?device_id=${deviceId}`);
  } catch (error) {
    console.error('Error playing next track:', error);
  }
};

export const previousTrack = () => async (dispatch, getState) => {
  const { deviceId } = getState().player;
  try {
    await instance.post(`https://api.spotify.com/v1/me/player/previous?device_id=${deviceId}`);
  } catch (error) {
    console.error('Error playing previous track:', error);
  }
};

export const playTrack = () => async (dispatch, getState) => {
  const { tracks, offset } = getState().player;
  if (tracks.length > 0) {
    const track = tracks[offset];
    try {
      await instance.put(`https://api.spotify.com/v1/me/player/play?device_id=${track.device_id}`, {
        context_uri: track.context_uri,
        uris: [track.track.uri],
      });
      dispatch(setIsPlaying(true));
    } catch (error) {
      console.error('Error playing track:', error);
    }
  }
};

export const pauseTrack = () => async (dispatch) => {
  try {
    await instance.put('https://api.spotify.com/v1/me/player/pause');
    dispatch(setIsPlaying(false));
  } catch (error) {
    console.error('Error pausing track:', error);
  }
};

export const seekTrack = (ms) => async (dispatch) => {
  try {
    await instance.put(`/me/player/seek?position_ms=${ms}`);
    dispatch({ type: "SEEK_SONG" });
  } catch (error) {
    console.error("Error seeking track:", error);
  }
};


export const repeatContext = (status) => async (dispatch) => {
  try {
    await instance.put(`/me/player/repeat?state=${status}`);
    dispatch({ type: "REPEAT" });
  } catch (error) {
    console.error("Error setting repeat context:", error);
  }
};

export const shuffle = (status) => async (dispatch) => {
  try {
    await instance.put(`/me/player/shuffle?state=${status}`);
    dispatch({ type: "SHUFFLE" });
  } catch (error) {
    console.error("Error setting shuffle status:", error);
  }
};

export const setVolume = (volume) => async (dispatch) => {
  try {
    await instance.put(`/me/player/volume?volume_percent=${volume}`);
    dispatch({ type: "SET_VOLUME" });
  } catch (error) {
    console.error("Error setting volume:", error);
  }
};

export const currentTrack = (track) => async (dispatch) => {
  try {
    await instance.put(`/me/player/play`, { context_uri: track.uri });
    dispatch({ type: "CURRENT_TRACK", track });
  } catch (error) {
    console.error("Error setting current track:", error);
  }
};

export const playing = () => ({
  type: "PLAYING",
  playing: true
});

export const setCurrentTrack = (track) => ({
  type: 'SET_CURRENT_TRACK',
  payload: track,
});

export const setIsPlaying = (isPlaying) => ({
  type: 'SET_IS_PLAYING',
  payload: isPlaying,
});

export const setTrackPosition = (position) => ({
  type: 'SET_TRACK_POSITION',
  payload: position,
});

export const setDeviceId = (deviceId) => ({
  type: 'SET_DEVICE_ID',
  payload: deviceId,
});


export const playTracks = (tracks, offset) => async (dispatch, getState) => {
  const { deviceId } = getState().player;
  try {
    await instance.get(`/me/play/player`);
    dispatch({
      type: "PLAY_TRACKS",
      payload: {
        tracks,
        offset,
        deviceId
      }
    });
  } catch (error) {
    console.error("Error playing tracks:", error);
  }
};




export const setSpotifyPlayer = (player) => ({
  type: "SET_SPOTIFY_PLAYER",
  player
});

export const setStatus = (status) => (dispatch) => {
  dispatch({
    type: "FETCH_STATUS_SUCCESS",
    status
  });
  if (status) {
    dispatch(setCurrentTrack(status.track_window.current_track));
    dispatch(setTrackPosition(status.position));
    dispatch(setIsPlaying(!status.paused));
  }
};