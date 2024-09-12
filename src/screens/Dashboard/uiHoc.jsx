import React from 'react';

export default function withUiActions(ComposedComponent) {
  return props => {
    const showModal = () => {
      props.setModal(true, 'playlist');
    };
    const onPlaylistClick = id => {
      props.fetchPlaylist(id);
      props.setView('playlist');
    };
    const onArtistClick = id => {
      props.fetchArtist(id);
      props.setView('artist');
    };
    const onAlbumClick = id => {
      props.fetchAlbum(id);
      props.setView('album');
    };
    const onSearch = () => {
      props.setView('search');
    };

    return (
      <ComposedComponent
        {...props}
        showModal={showModal}
        onPlaylistClick={onPlaylistClick}
        onArtistClick={onArtistClick}
        onAlbumClick={onAlbumClick}
        onSearch={onSearch}
      />
    );
  };
}
