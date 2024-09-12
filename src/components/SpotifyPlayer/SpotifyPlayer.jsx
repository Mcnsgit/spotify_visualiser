import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useSpotifyPlayer from '../../hooks/useSpotifyPlayer';

const SpotifyPlayer = () => {
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get('/login'); // Ensure the endpoint is correct
        setToken(response.data.accessToken);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    fetchToken();
  }, []);

  useSpotifyPlayer(token);

  const searchTrack = async (query) => {
    try {
    const response = await axios.get(`/api/search?q=${query}`);
    console.log(response.data);
  } catch (error) {
    console.error('Error searching track:', error);
  }
  };

  const addTrackToPlaylist = async (playlistId, trackUri) => {
    try {
    await axios.post('/api/playlist/add', { playlistId, trackUri });
  } catch (error) {
    console.error('Error adding track to playlist:', error);
  }

  return (
    <div>
      <h1>Spotify Player</h1>
      <button onClick={() => searchTrack('Song Name')}>Search for Song</button>
      <button onClick={() => addTrackToPlaylist('playlistId', 'spotify:track:trackUri')}>Add to Playlist</button>
    </div>
  );
};
}
export default SpotifyPlayer;