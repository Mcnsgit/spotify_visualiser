// src/context/GlobalStateContext.jsx
import React, { createContext, useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import { initialState, reducer } from './globalStateUtils';

export const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalStateContext.Provider value={[state, dispatch]}>
      {children}
    </GlobalStateContext.Provider>
  );
};

GlobalStateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};

// const fetchPlaylists = async (dispatch) => {
//   try {
//     const { data } = await axios.get('https://api.spotify.com/v1/me/playlists');
//     dispatch({ type: reducerCases.SET_PLAYLISTS, playlists: data.items });
//   } catch (error) {
//     console.error('Error fetching playlists:', error);
//   }
// };
//   const login = AuthService.login;
//   const logout = () => {
  //     localStorage.removeItem('spotify_access_token');
  //     setState((prevState) => ({ ...prevState, user: null, token: null, loggedIn: false }));
  //   };
  
  
//   const fetchPlaylists = async () => {
//     try {
//       const { data } = await axios.get('https://api.spotify.com/v1/me/playlists');
//       setState((prevState) => ({ ...prevState, playlists: data.items }));
//     } catch (error) {
//       console.error('Error fetching playlists:', error);
//     }
//   };
//   const fetchUser = useCallback(async () => {
//     if (state.token) {
//       try {
//         const { data } = await axios.get('https://api.spotify.com/v1/me', {
//           headers: {
//             Authorization: `Bearer ${state.token}`,
//           },
//         });
//         setState((prevState) => ({
//           ...prevState,
//           user: data,
//           loggedIn: true,
//         }));
//       } catch (error) {
//         console.error('Error fetching user:', error);
//       }
//     }
//   }, [state.token]);

//   const setToken = (token) => {
//     localStorage.setItem('spotify_access_token', token);
//     spotifyApi.setAccessToken(token);
//     setState((prevState) => ({ ...prevState, token, loggedIn: true }));
//   };

//   useEffect(() => {
//     fetchUser();
//   }, [fetchUser]);
//   const playTrack = async (trackUri) => {
//     try {
//       await axios.put('https://api.spotify.com/v1/me/player/play', { uris: [trackUri] });
//       setState((prevState) => ({ ...prevState, isPlaying: true }));
//     } catch (error) {
//       console.error('Error playing track:', error);
//     }
//   };

//   const pauseTrack = async () => {
//     try {
//       await axios.put('https://api.spotify.com/v1/me/player/pause');
//       setState((prevState) => ({ ...prevState, isPlaying: false }));
//     } catch (error) {
//       console.error('Error pausing track:', error);
//     }
//   };

//   const getUserLikedTracks = async () => {
//     try {
//       const { data } = await axios.get('https://api.spotify.com/v1/me/track?limit=50&offset=0');
//       setState((prevState) => ({ ...prevState, likedTracks: data.items }));
//     } catch (error) {
//       console.error('Error fetching liked tracks:', error);
//     }
//   }
//   const fetchNowPlaying = async () => {
//     try {
//       const { data } = await axios.get('https://api.spotify.com/v1/me/player/currently-playing');
//       if (data && data.item) {
//         setState((prevState) => ({
//           ...prevState,
//           nowPlaying: {
//             name: data.item.name,
//             artist: data.item.artists[0]?.name,
//             albumImageUrl: data.item.album.images[0]?.url,
//           },
//         }));
//       } else {
//         setState((prevState) => ({
//           ...prevState,
//           nowPlaying: null,
//         }));
//       }
//     } catch (error) {
//       console.error('Error fetching currently playing track:', error);
//     }
//   };

//   const dispatch = useCallback((action) => {
//     setState((prevState) => {
//       switch (action.type) {
//         case 'SET_PLAYER_STATE':
//           return { ...prevState, playerState: action.playerState };
//         case 'SET_PLAYING':
//           return { ...prevState, currentlyPlaying: action.currentlyPlaying };
//         case 'SET_USER':
//           return { ...prevState, user: action.userInfo };
//         case 'SET_TOKEN':
//           return { ...prevState, token: action.token };
//         case 'SET_PLAYLISTS':
//           return { ...prevState, playlists: action.playlists };
//         case 'SET_PLAYLIST_ID':
//           return { ...prevState, selectedPlaylistId: action.selectedPlaylistId };
//         case 'SET_PLAYLIST':
//           return { ...prevState, selectedPlaylist: action.selectedPlaylist };
//         default:
//           return prevState;
//       }
//     });
//   }, []);

//   const setModal = (show) => {
//     setState((prevState) => ({ ...prevState, showModal: show }));
//   };

//   const fetchPlaylistsMenu = async () => {
//     try {
//       const { data } = await axios.get('https://api.spotify.com/v1/me/playlists', {
//         headers: {
//           Authorization: `Bearer ${state.token}`,
//         },
//       });
//       setState((prevState) => ({ ...prevState, playlists: data.items }));
//     } catch (error) {
//       console.error('Error fetching playlists:', error);
//     }
//   };

//   const updatePlaylist = (updatedPlaylist) => {
//     setState((prevState) => ({
//       ...prevState,
//       playlists: prevState.playlists.map((playlist) =>
//         playlist.id === updatedPlaylist.id ? updatedPlaylist : playlist
//       ),
//     }));
//   };

//   return (
//     <GlobalStateContext.Provider
//       value={{ state, login, logout, fetchPlaylistsMenu, dispatch, setToken, setModal, updatePlaylist,fetchPlaylists, playTrack, pauseTrack, fetchNowPlaying  }}
//     >
//       {children}
//     </GlobalStateContext.Provider>
//   );
// };

// GlobalStateProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// export const useGlobalState = () => {
//   const context = useContext(GlobalStateContext);
//   if (context === undefined) {
//     throw new Error('useGlobalState must be used within a GlobalStateProvider');
//   }
//   return context;
// };
