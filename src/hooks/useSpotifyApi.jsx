
import { useState, useEffect } from "react";
import { fetchUserPlaylists, fetchPlaylistTracks, searchTracks, fetchUserProfile } from "../api/api";
import AuthService from "../services/AuthService";
import axios from "axios";
import instance from "../utils/axios";


 
export const useUserPlaylists = async () => {
	const [playlists, setPlaylists] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const loadPlaylists = async () => {
		  try {
			setLoading(true);
			const response = await axios.get("/me/playlists");
			setPlaylists(response.data.items);
		  } catch (err) {
			setError(err);
		  } finally {
			setLoading(false);
		  }
		};
		loadPlaylists();
	  }, []);
	
	  return { playlists, error, loading };
	};

export const useUserPlaylistTracks = (playlistId) => {
	const [tracks, setTracks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	useEffect(() => {
		const loadTracks = async () => {
		  if (!playlistId) return;
		  try {
			setLoading(true);
			const response = await axios.get(`/playlists/${playlistId}/tracks`, {
			  headers: {
				Authorization: `Bearer ${localStorage.getItem("spotify_access_token")}`,
			  },
			});
			setTracks(response.data.items);
		  } catch (err) {
			setError(err);
		  } finally {
			setLoading(false);
		  }
		};
		loadTracks();
	  }, [playlistId]);
	
	  return { tracks, error, loading };
	};


	export const useSearchTracks = (query) => {
		const [results, setResults] = useState([]);
		const [loading, setLoading] = useState(false);
		const [error, setError] = useState(null);
	  
		useEffect(() => {
		  const search = async () => {
			if (!query) {
			  setResults([]);
			  return;
			}
			try {
			  setLoading(true);
			  const response = await axios.get("/search", {
				params: { q: query, type: "track", market: "GB", limit: 20 },
				headers: {
				  Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			  });
			  setResults(response.data.tracks.items || []);
			} catch (err) {
			  setError(err);
			} finally {
			  setLoading(false);
			}
		  };
	  
		  search();
		}, [query]);
	  
		return { results, loading, error };
	  };			

export const useUserProfile = () => {
	const [profileImage, setProfileImage] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
  
	useEffect(() => {
		const fetchUserProfile = async () => {
			const accessToken = localStorage.getItem("access_token");
			if (!accessToken) {
			  console.error("No access token found. Redirecting to login...");
			  window.location.href = '/login';
			  return;
			}
		  
			try {
			  const response = await axios.get("https://api.spotify.com/v1/me", {
				headers: {
				  Authorization: `Bearer ${accessToken}`,
				},
			  });
			  console.log("User Profile:", response.data);
			} catch (error) {
			  if (error.response?.status === 401) {
				console.error("Access token expired. Redirecting to login...");
				window.location.href = '/login';
			  } else {
				console.error("Error fetching user profile:", error);
			  }
			}
		  };
		  fetchUserProfile();
		}, []);
		return { profileImage, displayName, loading, error };
	  };
