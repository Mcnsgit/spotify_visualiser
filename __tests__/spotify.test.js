// src/api/spotify.test.js
import axios from 'axios';
import { fetchUserPlaylists, fetchPlaylistTracks, searchTracks, fetchUserProfile } from './spotify';

jest.mock('axios');

describe('Spotify API', () => {
  const token = 'test-token';

  beforeEach(() => {
    localStorage.setItem('spotify_access_token', token);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fetchUserPlaylists should fetch playlists', async () => {
    const playlists = { items: [{ name: 'Test Playlist' }] };
    axios.get.mockResolvedValue({ data: playlists });

    const result = await fetchUserPlaylists();

    expect(axios.get).toHaveBeenCalledWith('https://api.spotify.com/v1/me/playlists', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(result).toEqual(playlists);
  });

  test('fetchPlaylistTracks should fetch playlist tracks', async () => {
    const tracks = { items: [{ track: { name: 'Test Track' } }] };
    axios.get.mockResolvedValue({ data: tracks });

    const result = await fetchPlaylistTracks('playlistId');

    expect(axios.get).toHaveBeenCalledWith('https://api.spotify.com/v1/playlists/playlistId/tracks', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(result).toEqual(tracks);
  });

  test('searchTracks should search for tracks', async () => {
    const results = { tracks: { items: [{ name: 'Test Track' }] } };
    axios.get.mockResolvedValue({ data: results });

    const result = await searchTracks('test query');

    expect(axios.get).toHaveBeenCalledWith('https://api.spotify.com/v1/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: 'test query', type: 'track' },
    });
    expect(result).toEqual(results);
  });

  test('fetchUserProfile should fetch user profile', async () => {
    const profile = { display_name: 'Test User' };
    axios.get.mockResolvedValue({ data: profile });

    const result = await fetchUserProfile();

    expect(axios.get).toHaveBeenCalledWith('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(result).toEqual(profile);
  });
});
