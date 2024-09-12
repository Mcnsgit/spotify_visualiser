import { fetchUserPlaylists, fetchPlaylistTracks } from '../src/services/AuthService';
import axios from 'axios';

jest.mock('axios');

describe('Spotify API Calls', () => {
  it('should fetch user playlists', async () => {
    const playlists = [{ id: '1', name: 'My Playlist' }];
    axios.get.mockResolvedValue({ data: playlists });

    const result = await fetchUserPlaylists();
    expect(result).toEqual(playlists);
  });

  it('should fetch tracks from a playlist', async () => {
    const tracks = [{ id: 'track1', name: 'Song 1' }];
    axios.get.mockResolvedValue({ data: tracks });

    const result = await fetchPlaylistTracks('1', 'sample_token');
    expect(result).toEqual(tracks);
  });
});
