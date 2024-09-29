
import api from './axios';
// src/utils/spotifyUtils.js
import SpotifyWebApi from 'spotify-web-api-js';
import axios from 'axios';
import {extractPath} from './utils';

const spotifyApi = new SpotifyWebApi();
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || '1f42356ed83f46cc9ffd35c525fc8541';
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

export const setAccessToken = (accessToken, setAccessTokenContext) => {
  spotifyApi.setAccessToken(accessToken);
  setAccessTokenContext(accessToken);
};
export async function getAccessToken() {
	const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
	try {
		const response = await fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			headers: {
				'Authorization': `Basic ${authHeader}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				grant_type: 'client_credentials',
			}),
		});

		const data = await response.json();
		if (response.ok) {
			return data.access_token;
		} else {
			throw new Error(`Error fetching access token: ${data.error_description}`);
		}
	} catch (error) {
		console.error('Error fetching access token:', error);
		return null;
	}
}

export async function fetchWebApi(endpoint, method= 'GET', body) {
	const TOKEN = await getAccessToken();
	const res = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
		headers: {
			'Authorization': `Bearer ${TOKEN}`,
			'Content-Type': 'application/json',
		},
		method,
		...(method !== 'GET' && { body: JSON.stringify(body) })
		});

		if (!res.ok) {
			const error = await res.text();
			throw new Error(`Error fetching data: ${error}`);
		}

		return await res.json();
}
export async function getTrackData(id) {
    try {
        const response = await fetchWebApi(`tracks/${id}`)
        return response
    } catch (error){
        console.error('Failed to fetch tracks :', error);
        return [];
    }
}
export async function getTracksData(playlist_id) {
    const responsePreviewPlaylistData = await fetchWebApi(`playlists/${playlist_id}`);

    const formattedPreviewPlaylistData = {
        owner: responsePreviewPlaylistData.owner.display_name,
        name: responsePreviewPlaylistData.name,
        image: responsePreviewPlaylistData.images[0].url
    };

    const fetchTracks = async (currentOffset) => {
        try {
            const response = await fetchWebApi(`playlists/${playlist_id}/tracks?locale=en_US&limit=100&offset=${currentOffset}`);
            return response.items;
        } catch (error) {
            console.error('Failed to fetch tracks from playlists:', error);
            return [];
        }
    };

    let allTracks = [];
    let currentOffset = 0;
    let hasNullPreviewUrl = true;

    while (hasNullPreviewUrl) {
        const tracks = await fetchTracks(currentOffset);
        if (tracks.length === 0) break;

        const validTracks = tracks
            .filter(item => item.track.preview_url !== null)
            .map(item => item.track);

        allTracks = allTracks.concat(validTracks);

        hasNullPreviewUrl = tracks.some(item => item.track.preview_url === null);

        currentOffset += 100;
    }

    return {
        mixes_data: formattedPreviewPlaylistData,
        tracks: allTracks
    };
}

export async function AnalysisData(trackId) {
    try {
        const response = await fetchWebApi(`audio-analysis/${trackId}`)
        return response
    } catch (error) {
        console.error('Error fetching audio analysis data', error);
    }
}
export async function getSearchData(query, types, offset = 0, limit = 12) {
    try {
        const response = await fetchWebApi(`search?q=${query}&type=${types.join('%2C')}&include_external=audio&offset=${offset}&limit=${limit}`);

        return types.reduce((acc, type) => {
            return {
                ...acc,
                [`${type}s`]: response[`${type}s`].items
            }
        }, {})
    } catch (error) {
        console.error('Error fetching search data', error);
        return {
            artists: [],
            playlists: [],
            tracks: []
        };
    }
}

const types = {
    artist: {
        updatePath: 'top-tracks',
        resolveResponse: (response) => {
            return {
                tracks: response.tracks.map(elem => ({
                    artists: elem.album.artists.map(artist => artist.name).join(', '),
                    image: elem.album.images[2].url,
                    name: elem.name,
                    audio: elem.preview_url || null
                }))
            }
        }
    },
    playlist: {
        updatePath: 'tracks',
        resolveResponse: (response) => {
            return {
                tracks: response.items.map(elem => ({
                    artists: elem.track.artists.map(artist => artist.name).join(', '),
                    image: elem.track.album.images[2].url,
                    name: elem.track.name,
                    audio: elem.track.preview_url
                }))
            }
        }
    },
    track: {
        updatePath: '',
        resolveResponse: (response) => {
            return {
                tracks: [
                    {
                        artists: response.artists.map(artist => artist.name).join(', '),
                        image: response.album.images[2].url,
                        name: response.name,
                        audio: response.preview_url || null
                    }
                ]
            }
        }
    }
}
export const refreshAccessToken = async (refreshToken, setAccessTokenContext) => {
  try {
    const response = await axios.get('https://localhost:3001/refresh', {
      params: { refreshToken: refreshToken },
    });
    const { accessToken } = response.data;
    setAccessToken(accessToken, setAccessTokenContext);
    return accessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error; // Propagate the error for handling in the calling component
  }
};

export const getUserData = async (accessToken) => {
  spotifyApi.setAccessToken(accessToken);
  return await spotifyApi.getMe();
};

// Base URL for Spotify API

const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 'http://localhost:3000';

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/en/authorize';
const SCOPES = ['streaming', 'user-read-private', 'user-read-email', 'playlist-read-private', 'user-library-read', 'user-library-modify', 'user-read-playback-state', 'user-modify-playback-state'];
export const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES.join('%20')}&response_type=token&show_dialog=true`;

// https://accounts.spotify.com/en/authorize?client_id=1f42356ed83f46cc9ffd35c525fc8541&redirect_uri=http://localhost:3000&scope=streaming%20user-read-private%20user-read-email%20playlist-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state&response_type=token&show_dialog=true
export const apiClient = axios.create({
	baseURL: 'http://localhost:3000',
	withCredentials: true
});
const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";

/**
 * Get the access token from local storage or other storage mechanism.
 */

export async function getAccessToken(code) {
	const response = await axios.post(TOKEN_ENDPOINT, null, {
	  params: {
		grant_type: 'authorization_code',
		code,
		redirect_uri: REDIRECT_URI,
		client_id: CLIENT_ID,
		client_secret: 'YOUR_CLIENT_SECRET', // Replace with your actual Client Secret
	  },
	  headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
	  },
	});
  
	return response.data.accessToken;
  }
//!SECTION  getToken  Client Credentials oAuth2 flow to authenticate against
export const getToken = async () => {
	try {
		const response = await axios.post('https://accounts.spotify.com/api/token', {
			grant_type: 'client_credentials',
			},
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')),
				},
			}
		);
		return response.data.accessToken;
	} catch (error) {
		console.error(error);
	}
};
			
// export async function getInfo(){
// 	try {
// 	  const data = await fetch(new Request(
// 		'https://api.spotify.com/v1/me/player',
// 		{ 
// 		  headers: new Headers({ 
// 			'Authorization': 'Bearer ' + getCookie('DAZUMA_accessToken'), 
// 			'Accept': 'application/json' 
// 		  }) 
// 		}
// 	  ))
// 	  .then(res =>{
// 		if (res.statusText !== "No Content")
// 		  return res.json();
// 		else
// 		  throw new Error('No content');
// 	  })
// 	  .then(res => {
// 		if (res.error && res.error.status === 401)
// 		  getToken();
  
// 		return res;
// 	  });
  
// 	  return data;
// 	}
// 	catch(err){
// 	  return { is_playing: false, item: { error: 'No Content' } }
// 	}
//   } 


//!SECTION`refreshToken: Responsible for refreshing the access token. if it expires.

// export const refreshToken = async () => {
// 	try {	
// 		const response = await axios.get("https://localhost:3001/refreshToken");
// 		withCredentials: true,
// 		localStorage.setItem("accessToken", response.data.token);
// 		return response.data.token;
// 	} catch (error) {
// 		console.error("Error refreshing access token:", error);
// 		throw error;
// 	}
// }
/**
 * Make a GET request to the Spotify API.
 * @param {string} endpoint - The API endpoint to call.
 * @param {object} [params={}] - Query parameters for the request.
 */

const handleRequest = async (requestFunction) => {
  const token = getAccessToken();
  try {
    return await requestFunction(token);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      const newToken = await refreshToken();
      if (newToken) {
        return await requestFunction(newToken);
      }
    }
    throw error;
  }
};

/**
 * Make a GET request to the Spotify API.
 * @param {string} endpoint - The API endpoint to call.
 * @param {object} [params={}] - Query parameters for the request.
 */
const get = async (endpoint, params = {}) => {
	const token = getAccessToken();
	try {
		const response = await axios.get(`${SPOTIFY_BASE_URL}${endpoint}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			params,
		});
		return response.data;
	} catch (error) {
		console.error("Spotify API GET request failed:", error);
		throw error;
	}
};
/**
 * Make a PUT request to the Spotify API.
 * @param {string} endpoint - The API endpoint to call.
 * @param {object} data - The data to send in the request body.
 */
const put = async (endpoint, data = {}) => {
	const token = getAccessToken();
	try {
		const response = await axios.put(`${SPOTIFY_BASE_URL}${endpoint}`, data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Spotify API PUT request failed:", error);
		throw error;
	}
};
/**
 * Fetch user's playlists.
 */
export const fetchUserPlaylists = () => get("/me/playlists");

/**
 * Fetch tracks in a playlist.
 * @param {string} playlistId - The ID of the playlist.
 */
// export const fetchPlaylistTracks = (playlistId) => get(`/playlists/${playlistId}/tracks`);

/**
 * Search for tracks.
 * @param {string} query - The search query.
 */
export const searchTracks = (query, market, limit = 20, offset = 0) => {
	return get("/search", { q: query, type: "track", market, limit, offset });
};

/**
 * Fetch audio analysis for a track.
 * @param {string} trackId - The Spotify ID of the track.
 */
export const getAudioApiAnalysis = (trackId) => get(`/audio-analysis/${trackId}`);

/**
 * Fetch audio features for a track.
 * @param {string} trackId - The Spotify ID of the track.
 */
export const getAudioApiFeatures = (trackId) => get(`/audio-features/${trackId}`);

/**
 * Fetch audio features for multiple tracks.
 * @param {string} trackIds - Comma-separated Spotify IDs of the tracks.
 */
export const getMultipleAudioApiFeatures = (trackIds) => get("/audio-features", { ids: trackIds });

/**
 * Fetch user's profile information.
 */
export const fetchUserProfile = () => get("/me");


/**
 * Play a track.
 * @param {string} deviceId - The Spotify Connect device ID.
 * @param {Array} uris - The Spotify URIs to play.
 */
export const playTrack = (deviceId, uris) => put(`/me/player/play?device_id=${deviceId}`, { uris });

/**
 * Pause playback.
 * @param {string} deviceId - The Spotify Connect device ID.
 */
export const pausePlayback = (deviceId) => put(`/me/player/pause?device_id=${deviceId}`);

/**
 * Skip to the next track.
 * @param {string} deviceId - The Spotify Connect device ID.
 */
export const skipToNext = (deviceId) => put(`/me/player/next?device_id=${deviceId}`);

export async function auth(){
	await fetch('https://localhost:3001/auth')
	  .then(res => res.json())
	  .then(res => res.auth_id ? window.location.href = 'https://localhost:3001/login?auth_id='+ res.auth_id : null) 
	  .catch(err => console.error(err))
}

export const login = () => {
	window.location.href = 'https://localhost:3001/login';
  };
  
export async function fetchPlaylistTracks(playlistId, accessToken) {
	try {
	  const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
		headers: {
		  Authorization: `Bearer ${accessToken}`,
		},
		params: {
		  limit: 50, // You can adjust the limit as needed (max is 100)
		},
	  });
  
	  // Extract tracks from response data
	  const tracks = response.data.items.map(item => ({
		name: item.track.name,
		artists: item.track.artists.map(artist => artist.name).join(', '),
		album: item.track.album.name,
		preview_url: item.track.preview_url,
		uri: item.track.uri,
	  }));
  
	  return tracks;
	} catch (error) {
	  console.error('Error fetching playlist tracks:', error);
	  return [];
	}
  }


// // Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
// async function fetchWebApi(endpoint, method, body) {
// const token = getAccessToken();
// const options = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     method,
//   };

//   // Only include body if method is not GET
//   if (method !== 'GET' && body) {
//     options.body = JSON.stringify(body);
//   }
// try{
//   const res = await fetch(`https://api.spotify.com/${endpoint}`, options);

//   if (!res.ok) {
// 	throw new Error(`https error! status: ${res.status}`);
//   }

//   return await res.json();
// } catch (error) {
//   console.error('Fetch error:', error);
//   throw error; // Rethrow the error for further handling if needed
// }
// }

// const topTracksIds = [
// '4qXjXZPGtVNhQq1z9QDRFn', '7wZvMqd4LJJ08COoBkai3v', '3bgaDjKLaicRMFD3Vmw3wv', '3EwCOs6Dh5tlsbIpvMjH4I', '34mhUL0A8oPJbg1DWe1HMK'
// ];

// async function getRecommendations() {
// // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-recommendations
// const response = await fetchWebApi(
//   `v1/recommendations?limit=5&seed_tracks=${topTracksIds.join(',')}`, 'GET'
// );
// return response.tracks;
// }

// try {
// const recommendedTracks = await getRecommendations();
// console.log(
//   recommendedTracks.map(
// 	({ name, artists }) =>
// 	  `${name} by ${artists.map(artist => artist.name).join(', ')}`
//   )
// );
// } catch (error) {
// console.error('Error fetching recommendations:', error);
// }

//     method,
//     body:JSON.stringify(body)
//   });
//   return await res.json();
// }

// const topTracksIds = [
//   '4qXjXZPGtVNhQq1z9QDRFn','7wZvMqd4LJJ08COoBkai3v','3bgaDjKLaicRMFD3Vmw3wv','3EwCOs6Dh5tlsbIpvMjH4I','34mhUL0A8oPJbg1DWe1HMK'
// ];

// async function getRecommendations(){
// 	  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-recommendations
// return (await fetchWebApi(
//     `v1/recommendations?limit=5&seed_tracks=${topTracksIds.join(',')}`, 'GET'
//   )).tracks;
// }

// const recommendedTracks = await getRecommendations();
// console.log(
//   recommendedTracks.map(
//     ({name, artists}) =>
//       `${name} by ${artists.map(artist => artist.name).join(', ')}`
//   )
// );	