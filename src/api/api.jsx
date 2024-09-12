import axios from "axios";
import {getCookie} from '../helpers/common';

// Base URL for Spotify API

export const apiClient = axios.create({
	baseURL: 'https://localhost:3001/',
	withCredentials: true
});
const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";

/**
 * Get the access token from local storage or other storage mechanism.
 */
export const getAccessToken = () => {
	return localStorage.getItem("accessToken");
};
//!SECTION getToken: Responsible for obtaining the token from the Spotify API.
export const getToken = async () => {
	try {
		const response = await axios.get("https://localhost:3001/getAuthUrl");
		return response.data.token;
	} catch (error) {
		console.error("Error getting access token:", error);
		throw error;
	}
}
export async function getInfo(){
	try {
	  const data = await fetch(new Request(
		'https://api.spotify.com/v1/me/player',
		{ 
		  headers: new Headers({ 
			'Authorization': 'Bearer ' + getCookie('DAZUMA_ACCESS_TOKEN'), 
			'Accept': 'application/json' 
		  }) 
		}
	  ))
	  .then(res =>{
		if (res.statusText !== "No Content")
		  return res.json();
		else
		  throw new Error('No content');
	  })
	  .then(res => {
		if (res.error && res.error.status === 401)
		  getNewToken();
  
		return res;
	  });
  
	  return data;
	}
	catch(err){
	  return { is_playing: false, item: { error: 'No Content' } }
	}
  } 

//!SECTION`refreshToken: Responsible for refreshing the access token. if it expires.

export const refreshToken = async () => {
	try {	
		const response = await axios.get("https://localhost:3001/refresh_token");
		withCredentials: true,
		localStorage.setItem("accessToken", response.data.token);
		return response.data.token;
	} catch (error) {
		console.error("Error refreshing access token:", error);
		throw error;
	}
}
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