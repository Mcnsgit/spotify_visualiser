import axios from 'axios';

import SpotifyWebApi from 'spotify-web-api-js';


const spotifyWebApi = new SpotifyWebApi();
const SpotifyWebAPI = ({token, dispatch}) => {
  const spotifyWebApi = new SpotifyWebApi();
  spotifyWebApi.setAccessToken(token);

  const getUserPlaylists = async () => {
    const response = await spotifyWebApi.getUserPlaylists({
      limit: 50,
    });
    return response;
  };
  const getPlaylistTracks = async (playlistId) => {
    const response = await spotifyWebApi.getPlaylistTracks(playlistId, {
      limit: 50,
    });
    return response;
  };
  const getPlaylist = async (playlistId) => {
    const response = await spotifyWebApi.getPlaylist(playlistId);
    return response;
  };
  const getTrack = async (trackId) => {
    const response = await spotifyWebApi.getTrack(trackId);
    return response;
  };
  const getAlbum = async (albumId) => {
    const response = await spotifyWebApi.getAlbum(albumId);
    return response;
  };
  const getAlbumsTracks = async (albumId) => {
    const response = await spotifyWebApi.getAlbumTracks(albumId);
    return response;
  };
  const getArtist = async (artistId) => {
    const response = await spotifyWebApi.getArtist(artistId);
    return response;
  };
  const getArtistAlbums = async (artistId) => {
    const response = await spotifyWebApi.getArtistAlbums(artistId);
    return response;
  };
  const getArtistTopTracks = async (artistId) => {
    const response = await spotifyWebApi.getArtistTopTracks(artistId);
    return response;
  };
  const getArtistRelatedArtists = async (artistId) => {
    const response = await spotifyWebApi.getArtistRelatedArtists(artistId);
    return response;
  };
  const getRecommendations = async (seedArtists, seedGenres, seedTracks) => {
    const response = await spotifyWebApi.getRecommendations({
      seed_artists: seedArtists,
      seed_genres: seedGenres,
      seed_tracks: seedTracks,
    });
    return response;
  };
  const getNewReleases = async () => {
    const response = await spotifyWebApi.getNewReleases();
    return response;
  };
  const getTopArtists = async () => {
    const response = await spotifyWebApi.getMyTopArtists();
    return response;
  };
  const getTopTracks = async () => {
    const response = await spotifyWebApi.getMyTopTracks();
    return response;
  };
  const search = async (query, types) => {
    const response = await spotifyWebApi.search(query, types);
    return response;
  };
  return {
    getUserPlaylists,
    getPlaylistTracks,
    getPlaylist,
    getTrack,
    getAlbum,
    getAlbumsTracks,
    getArtist,
    getArtistAlbums,
    getArtistTopTracks,
    getArtistRelatedArtists,
    getRecommendations,
    getNewReleases,
    getTopArtists,
    getTopTracks,
    search,
  };
};
export default SpotifyWebAPI;
/*

 
  getRecentlyPlayed: (token, options) => {
    return axios.get(`https://api.spotify.com/v1/me/player/recently-played`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: options,
    });
  },

  getMyCurrentPlaybackState: (token) => {
    return axios.get(`https://api.spotify.com/v1/me/player`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  transferMyPlayback: (token, options) => {
    return axios.put(`https://api.spotify.com/v1/me/player`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: options,
    });
  },

  addToMyPlaybackQueue: (token, options) => { 
    return axios.post(`https://api.spotify.com/v1/me/player/queue`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: options,

    });
  },
 
   removeFromMyPlaybackQueue: (token, options) => {
    return axios.delete(`https://api.spotify.com/v1/me/player/queue`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: options,
    });
  },
  getUserProfile: (token, options) => {
    return axios.get(`https://api.spotify.com/v1/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: options,
    })
    },
  
  };

  export default SpotifyWebApi;
  //other api functions

    // /**
    //  * Sets the access token to be used.
    //  * See [the Authorization Guide](https://developer.spotify.com/web-api/authorization-guide/) on
    //  * the Spotify Developer site for more information about obtaining an access token.
    //  * @param {string} accessToken The access token
    //  * @return {void}
    //  */
    // Constr.prototype.setAccessToken = function(accessToken) {
    //   _accessToken = accessToken;
    // };
  
    // /**
    //  * Fetches tracks from the Spotify catalog according to a query.
    //  * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
    //  * the Spotify Developer site for more information about the endpoint.
    //  * @param {Object} options A JSON object with options that can be passed
    //  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first
    //  * one is the error object (null if no error), and the second is the value if the request succeeded.
    //  * @return {Object} Null if a callback is provided, a `Promise` object otherwise
    //  */
    // Constr.prototype.searchTracks = function(query, options, callback) {
    //   var requestData = {
    //     url: _baseUri + '/search/',
    //     params: {
    //       q: query,
    //       type: 'track'
    //     }
    //   };
    //   return _checkParamsAndPerformRequest(requestData, options, callback);
    // };
  
    // /**
    //  * Get audio features for a single track identified by its unique Spotify ID.
    //  * See [Get Audio Features for a Track](https://developer.spotify.com/web-api/get-audio-features/) on
    //  * the Spotify Developer site for more information about the endpoint.
    //  * @param {string} trackId The id of the track. If you know the Spotify URI it is easy
    //  * to find the track id (e.g. spotify:track:<here_is_the_track_id>)
    //  * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
    //  * one is the error object (null if no error), and the second is the value if the request succeeded.
    //  * @return {Object} Null if a callback is provided, a `Promise` object otherwise
    //  */
    // Constr.prototype.getAudioFeaturesForTrack = function(trackId, callback) {
    //   var requestData = {
    //     url: _baseUri + '/audio-features/' + trackId
    //   };
    //   return _checkParamsAndPerformRequest(requestData, {}, callback);
    // };
  
    // /**
    //  * Obtains a token to be used against the Spotify Web API
    //  */
