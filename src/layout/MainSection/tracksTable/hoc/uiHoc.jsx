import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import propTypes from 'prop-types';
import { setView, setModal } from '../redux/actions/uiActions';
import { fetchPlaylistsMenu, fetchPlaylist } from '../redux/actions/playlistActions';
import { fetchArtist } from '../redux/actions/artistActions';
import { fetchAlbum } from '../redux/actions/albumActions';
import { fetchTracks,fetchMoreTracks } from '../redux/actions/libraryActions';
import { fetchSearchData, setQuery } from '../redux/actions/searchActions'; 
import {currentTrack, playing } from '../redux/actions/playerActions';



export default function(ComposedComponent) {
  class UiHoc extends Component {
    showModal = () => {
      this.props.setModal(true, 'playlist');
    };
    onPlaylistClick = id => {
      this.props.fetchPlaylist(id);
      this.props.setView('playlist');
    };
   

    onArtistClick = id => {
      this.props.fetchArtist(id);
      this.props.setView('artist');
    };

    onAlbumClick = id => {
      this.props.fetchAlbum(id);
      this.props.setView('album');
    };

    onSearch = () => {
      this.props.setView('search');
    };

    onMoreTracks = () => {
      this.props.fetchMoreTracks();
      this.props.setView('tracks');
    };

    onTrackClick = id => {
      this.props.fetchTracks(id);
      this.props.setView('tracks');
    };

    onQuery = query => {
      this.props.setQuery(query);
      this.props.fetchSearchData(query);
      this.props.setView('search');
    };
    
    pauseTrack = () => {
      this.props.pauseTrack();
    }
    playing =  () => {
      this.props.playing();
      
    }

    render = () => (
      <ComposedComponent
        {...this.props}
        showModal={this.showModal}
        onPlaylistClick={this.onPlaylistClick}
        onArtistClick={this.onArtistClick}
        onAlbumClick={this.onAlbumClick}
        onSearch={this.onSearch}
        onMoreTracks={this.onMoreTracks}
        onTrackClick={this.onTrackClick}
        onQuery={this.onQuery}
      />
    );
  }
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
}



  const mapDispatchToProps = dispatch => {
    return bindActionCreators(
      {fetchPlaylist,
        fetchPlaylistsMenu,
        fetchArtist,
        fetchAlbum,
        setView,
        setModal,
        fetchMoreTracks,
        fetchTracks,
        fetchSearchData,
      },
      dispatch
    );
  };

  return connect(
    null,
    mapDispatchToProps
  )(UiHoc);
}