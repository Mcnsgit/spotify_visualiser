import React from 'react';

import withUiActions from '../../../../../../hoc/uiHoc';

import ResultGroup from './resultGroup';
const results = ({
  tracks,
  artists,
  albums,
  playlists,
  changeMode,
  onAlbumClick,
  onArtistClick,
  onPlaylistClick
}) => (
  <div className="table-container">
    <div className="results-table">
      <div className="search-results">
        {tracks.length ? (
          <ResultGroup
            items={tracks}
            onClick={onAlbumClick}
            changeMode={changeMode}
            type="Tracks"
          />
        ) : null}
        {artists.length ? (
          <ResultGroup
            changeMode={changeMode}
            items={artists}
            onClick={onArtistClick}
            type="Artists"
          />
        ) : null}
        {albums.length ? (
          <ResultGroup
            changeMode={changeMode}
            items={albums}
            onClick={onAlbumClick}
            type="Albums"
          />
        ) : null}
        {playlists.length ? (
          <ResultGroup
            changeMode={changeMode}
            items={playlists}
            onClick={onPlaylistClick}
            type="Playlists"
          />
        ) : null}
      </div>
    </div>
  </div>
);

export default withUiActions(results);
