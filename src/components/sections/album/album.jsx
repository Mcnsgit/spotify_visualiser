import React, { Component } from 'react';
import Header from '../playlist/components/header/playlistHeader';
import Table from '../../songsTable/albumTable/albumTable';
import Spinner from '../../spinner/spinner';
import withStatus from '../../../hoc/statusHoc.jsx';

const Album = (props) => {
  const {
    album = {},
    fetching,
    currentUri,
    playing,
    pauseSong,
    playSong
  } = props;

  return (
    <Spinner section loading={fetching}>
      <div className="player-container">
        <Header
          playlist={album}
          album={true}
          currentUri={currentUri}
          playing={playing}
          pauseSong={pauseSong}
          playSong={() => playSong(album.uri, 0)}
        />
        <Table
          songs={album.tracks ? album.tracks : []}
          uri={album.uri || ''}
          {...props}
        />
      </div>
    </Spinner>
  );
};

export default withStatus(Album);