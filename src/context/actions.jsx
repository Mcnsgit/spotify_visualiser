export const setView = (view) => ({
    type: 'SET_VIEW',
    view,
  });
  
  export const setModal = (isOpen, modalType) => ({
    type: 'SET_MODAL',
    isOpen,
    modalType,
  });
  
  export const fetchPlaylistsMenu = () => ({
    type: 'FETCH_PLAYLISTS_MENU',
  });
  
  export const fetchPlaylist = (id) => ({
    type: 'FETCH_PLAYLIST',
    id,
  });
  
  export const fetchArtist = (id) => ({
    type: 'FETCH_ARTIST',
    id,
  });
  
  export const fetchAlbum = (id) => ({
    type: 'FETCH_ALBUM',
    id,
  });
  
  export const fetchTracks = (id) => ({
    type: 'FETCH_TRACKS',
    id,
  });
  
  export const fetchMoreTracks = () => ({
    type: 'FETCH_MORE_TRACKS',
  });
  
  export const fetchSearchData = (query) => ({
    type: 'FETCH_SEARCH_DATA',
    query,
  });
  
  export const setQuery = (query) => ({
    type: 'SET_QUERY',
    query,
  });
  
  export const currentTrack = (track) => ({
    type: 'SET_CURRENT_TRACK',
    track,
  });
  
  export const playing = () => ({
    type: 'PLAY_TRACK',
  });
  