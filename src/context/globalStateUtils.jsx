  import axios from '../utils/axios';
  import { getAuthToken } from '../helpers/auth';
  import { fetchUserPlaylists, fetchPlaylistTracks, playTrack as playTrackAPI, pausePlayback, fetchUserProfile } from '../api/api';
  import AuthService from '../services/AuthService';
  import SpotifyWebApi from 'spotify-web-api-js';
  import instance from '../utils/axios';
  import { setView } from './actions';
import { current } from '@reduxjs/toolkit';
import { containsTrack } from '../layout/MainSection/trackList/libraryActions';


  const spotifyApi = new SpotifyWebApi();

  // src/context/globalStateUtils.js

  export const initialState = {
    token: null,
    userInfo: null,
    playlists: [],
    currentlyPlaying: null,
    playerState: false,
    selectedPlaylist: null,
    selectedPlaylistId: null,
    volume:50,
    search: null,
    searchResults: null,
    isSearching: false,
    searchQuery: null,
    modal: false,
    showModal: false,
    displayName: null,
    userImage: null,
    categories: null,
    activeCategory: 'Genres & Moods',
    nextCategoryPage: null,
    currentTrack: null,
    containsTrack: false,
    player: {
      status: null,
      isPlaying: false,
      currentTrack: null,
      trackPosition: 0,
      deviceId: null,
    },
    library:{
      tracks: [],
      next: null,
      fetching: false,
      error: null
    }
  };

  export const reducerCases = {
    SET_TOKEN: 'SET_TOKEN',
    SET_USER: 'SET_USER',
    SET_PLAYLISTS: 'SET_PLAYLISTS',
    SET_PLAYING: 'SET_PLAYING',
    SET_PLAYER_STATE: 'SET_PLAYER_STATE',
    SET_PLAYLIST: 'SET_PLAYLIST',
    SET_PLAYLIST_ID: 'SET_PLAYLIST_ID',
    SET_VOLUME: 'SET_VOLUME',
    SET_SEARCH: 'SET_SEARCH',
    SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
    SET_MODAL: 'SET_MODAL',
    SET_SHOW_MODAL: 'SET_SHOW_MODAL',
    SET_DISPLAY_NAME: 'SET_DISPLAY_NAME',
    SET_USER_IMAGE: 'SET_USER_IMAGE',
    SET_ACTIVE_CATEGORY: 'SET_ACTIVE_CATEGORY',
    SET_NEXT_CATEGORY_PAGE: 'SET_NEXT_CATEGORY_PAGE',
    SET_CURRENT_TRACK: 'SET_CURRENT_TRACK',
    SET_CONTAINS_TRACK: 'SET_CONTAINS_TRACK',

  };


  export const reducer = (state, action) => {
    if (!action || !action.type) {
      throw new Error('Action type is required');
    }
    switch (action.type) {
      case reducerCases.SET_TOKEN:
        return { ...state, token: action.token };
      case reducerCases.SET_USER:
        return { ...state, userInfo: action.userInfo };
      case reducerCases.SET_PLAYLISTS:
        return { ...state, playlists: action.playlists };
      case reducerCases.SET_PLAYING:
        return { ...state, currentPlaying: action.currentPlaying };
      case reducerCases.SET_PLAYER_STATE:
        return { ...state, playerState: action.playerState };
      case reducerCases.SET_PLAYLIST:
        return { ...state, selectedPlaylist: action.selectedPlaylist };
      case reducerCases.SET_PLAYLIST_ID:
        return { ...state, selectedPlaylistId: action.selectedPlaylistId };
      case reducerCases.SET_VOLUME:
        return { ...state, volume: action.volume };
      case reducerCases.SET_SEARCH:
        return { ...state, searchKey: action.searchKey };
      case reducerCases.SET_SEARCH_RESULTS:
        return { ...state, searchResults: action.searchResults };
      case reducerCases.SET_SEARCH_QUERY:
        return { ...state, searchQuery: action.searchQuery };
      case reducerCases.SET_MODAL:
        return { ...state, modal: action.modal };
      case reducerCases.SET_VIEW:
        return { ...state, view: action.view };
      case reducerCases.SET_DISPLAY_NAME:
        return { ...state, displayName: action.displayName };
      case reducerCases.SET_USER_IMAGE:
        return { ...state, userImage: action.userImage };
      case reducerCases.SET_ACTIVE_CATEGORY:
        return { ...state, activeCategory: action.activeCategory };
      case reducerCases.SET_LIBRARY:
        return { ...state, library: action.library };
        case reducerCases.SET_CURRENT_TRACK:
          return { ...state, currentTrack: action.payload };
      case reducerCases.SET_CONTAINS_TRACK:
          return { ...state, containsTrack: action.payload };

        case 'SET_IS_PLAYING':
          return {
            ...state,
            player: {
              ...state.player,
              isPlaying: action.payload,
            },
          };
        case 'SET_CURRENT_TRACK':
          return {
            ...state,
            player: {
              ...state.player,
              currentTrack: action.payload,
            },
          };
        case 'SET_TRACK_POSITION':
          return {
            ...state,
            player: {
              ...state.player,
              trackPosition: action.payload,
            },
          };
        case 'SET_DEVICE_ID':
          return {
            ...state,
            player: {
              ...state.player,
              deviceId: action.payload,
            },
          };
        case 'FETCH_TRACKS_SUCCESS':
          return {
            ...state,
            library: {
              ...state.library,
              tracks: action.tracks.items,
              next: action.tracks.next,
            },
          };
        case 'FETCH_MORE_TRACKS_SUCCESS':
          return {
            ...state,
            library: {
              ...state.library,
              tracks: [...state.library.tracks, ...action.tracks],
              next: action.next,
            },
          };
        case 'FETCH_TRACKS_FAILURE':
          return {
            ...state,
            library: {
              ...state.library,
              error: action.error,
            },
          };
        case 'SET_IS_FETCHING':
          return {
            ...state,
            library: {
              ...state.library,
              fetching: action.payload,
            },  
          }
          
        default:
          return state;
    }
  };


  export const setupAxiosInterceptors = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Actions

  export const fetchNowPlaying = async (token, dispatch) => {
    try {
      const response = await instance.get('/me/player/currently-playing', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.item) {
        dispatch({
          type: reducerCases.SET_PLAYING,
          currentlyPlaying: {
            name: response.data.item.name,
            artist: response.data.item.artists[0]?.name,
            albumImageUrl: response.data.item.album.images[0]?.url,
          },
        });
      } else {
        dispatch({
          type: reducerCases.SET_PLAYING,
          currentlyPlaying: null,
        });
      }
    } catch (error) {
      console.error("Error getting playback state:", error);
    }
  };


  export const fetchTracksInPlaylist = async (playlistId, dispatch) => {
    try {
      const data = await fetchPlaylistTracks(playlistId);
      dispatch({
        type: reducerCases.SET_PLAYLIST,
        selectedPlaylist: data.items,
      });
    } catch (error) {
      console.error('Fetching tracks failed', error);
    }
  };

  export const login = () => {
    AuthService.login();
  };

  export const logout = (dispatch) => {
    localStorage.removeItem('spotify_access_token');
    dispatch({
      type: reducerCases.SET_TOKEN,
      token: null,
    });
    dispatch({
      type: reducerCases.SET_USER_PROFILE,
      user: null,
    });
  };

  export const fetchPlaylists = async (dispatch) => {
    try {
      const data = await fetchUserPlaylists();
      dispatch({
        type: reducerCases.SET_PLAYLISTS,
        playlists: data.items,
      });
    } catch (error) {
      console.error('Fetching playlists failed', error);
    }
  };

  export const playTrack = (deviceId, uris, dispatch) => {
    playTrackAPI(deviceId, uris)
      .then(() => dispatch({
        type: reducerCases.SET_IS_PLAYING,
        isPlaying: true,
      }))
      .catch((error) => console.error('Error playing track', error));
  };

  export const pauseTrack = (deviceId, dispatch) => {
    pausePlayback(deviceId)
      .then(() => dispatch({
        type: reducerCases.SET_IS_PLAYING,
        isPlaying: false,
      }))
      .catch((error) => console.error('Error pausing track', error));
  };

  export const fetchUser = async (dispatch) => {
    try {
      const data = await fetchUserProfile();
      dispatch({
        type: reducerCases.SET_USER_PROFILE,
        user: data,
      });
    } catch (error) {
      console.error('Fetching user profile failed', error);
    }
  };

  export const setToken = (token, dispatch) => {
    localStorage.setItem('spotify_access_token', token);
    spotifyApi.setAccessToken(token);
    dispatch({
      type: reducerCases.SET_TOKEN,
      token,
    });
  };



  export const setDisplayName = (displayName, dispatch) => {
    dispatch({
      type: reducerCases.SET_DISPLAY_NAME,
      displayName,
    });
  };

  export const setUserImage = (userImage, dispatch) => {
    dispatch({
      type: reducerCases.SET_USER_IMAGE,
      userImage,
    });
  };

  export const setSearch = (search, dispatch) => {
    dispatch({
      type: reducerCases.SET_SEARCH,
      search,
    });
  };

  export const setSearchResults = (searchResults, dispatch) => {
    dispatch({
      type: reducerCases.SET_SEARCH_RESULTS,
      searchResults,
    });
  };