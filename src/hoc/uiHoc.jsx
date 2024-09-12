import React, {useContext} from 'react';
import { GlobalStateContext } from '../context/GlobalStateContext';
import {
  fetchPlaylists,
  fetchUser,
  playTrack,
  pauseTrack,
  fetchNowPlaying,
  fetchTracksInPlaylist,
  setToken,
  login,
  logout
} from '../context/globalStateUtils';
import  propTypes from 'prop-types';
import { reducerCases } from '../utils/Constants';

  
export default function withUiActions(ComposedComponent) {
  const UiHoc = (props) => {
    const { state, dispatch } = useContext(GlobalStateContext);


    const showModal = () => {
      dispatch({ type: reducerCases.SET_SHOW_MODAL, payload: true });
    };

    const onPlaylistClick = async (id) => {
      await fetchTracksInPlaylist(id, dispatch);
      dispatch({ type: reducerCases.SET_VIEW, payload: 'playlist' });
    };
    const onArtistClick = async (id) => {
      await fetchArtist(id, dispatch);
        dispatch({ type: reducerCases.SET_VIEW, payload: 'artist' });
    };

    const onAlbumClick = async (id) => {
      const fetchAlbum = async (id, dispatch) => {
        try {
          const data = await fetchAlbum(id);
          dispatch({ type: reducerCases.SET_ALBUM, payload: data });
        } catch (error) {
          console.error('Fetching album failed', error);
        }
      };

      // Implement fetchAlbum logic here
      fetchAlbum(id, dispatch);
      dispatch({ type: reducerCases.SET_VIEW, payload: 'album' });
    };
    const onSearch = () => {
      dispatch({ type: reducerCases.SET_VIEW, payload: 'search' });
    };

    const onMoreTracks = () => {
      // Implement fetchMoreTracks logic here    
        fetchTracksInPlaylist(state.selectedPlaylistId, dispatch);
        dispatch({ type: reducerCases.SET_VIEW, payload: 'tracks' });
    };

    const onTrackClick = (id) => {
        fetchTracksInPlaylist(id, dispatch);
        dispatch({ type: reducerCases.SET_VIEW, payload: 'tracks' });
    };

    const onQuery = (query) => {
      // Implement setQuery and fetchSearchData logic here
        setQuery(query, dispatch);
        fetchSearchData(query, dispatch);
        dispatch({ type: reducerCases.SET_VIEW, payload: 'search' });

    };

    const pauseTrackHandler = () => {
      pauseTrack(state.selectedPlaylistId, dispatch);
      dispatch({ type: reducerCases.SET_IS_PLAYING, payload: false });
      fetchNowPlaying(dispatch);
      dispatch({ type: reducerCases.SET_VIEW, payload: 'tracks' });
    };

    const playTrackHandler = () => {
      playTrack(state.selectedPlaylistId, [state.currentTrack.uri], dispatch);
      dispatch({ type: reducerCases.SET_IS_PLAYING, payload: true });
      fetchNowPlaying(dispatch);
      dispatch({ type: reducerCases.SET_VIEW, payload: 'tracks' });

    };

    return (
      <ComposedComponent
        {...props}
        showModal={showModal}
        onPlaylistClick={onPlaylistClick}
        onArtistClick={onArtistClick}
        onAlbumClick={onAlbumClick}
        onSearch={onSearch}
        onMoreTracks={onMoreTracks}
        onTrackClick={onTrackClick}
        onQuery={onQuery}
        pauseTrack={pauseTrackHandler}
        playTrack={playTrackHandler}  
      />
    );
  };

  UiHoc.propTypes = {
    fetchPlaylistsMenu: propTypes.func,
    fetchArtist: propTypes.func,
    fetchAlbum: propTypes.func,
    setView: propTypes.func,
    setModal: propTypes.func,
    fetchMoreTracks: propTypes.func,
    fetchTracks: propTypes.func,
    fetchSearchData: propTypes.func,
    setQuery: propTypes.func,
  };

  return UiHoc;
}