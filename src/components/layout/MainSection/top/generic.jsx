import React, { Component } from 'react';

import {api} from '../../../utils/api';
import Spinner from '../../../components/spinner/spinner';
import withUiAction from '../../../hoc/uiHoc';
import Album from '../tracksTable/items/album';
import Artist from '../tracksTable/items/artist';

import './generic.css';

class Generic extends Component {
  state = {
    items: [],
    fetching: true,
    next: null
  };

  componentDidMount() {
    api.get(this.props.url).then(r => {
      const response =
        r.data.artists || r.data.albums || r.data.playlists || r.data;
      this.setState({
        fetching: false,
        items: response.items,
        next: response.next
      });
    });
  }

  fetchMore = () => {
    if (this.state.next) {
      api.get(this.state.next).then(r => {
        const response =
          r.data.artists || r.data.albums || r.data.playlists || r.data;
        this.setState(prevState => {
          return {
            items: [...prevState.items, ...response.items],
            next: response.next
          };
        });
      });
    }
  };

  render = () => {
    const GenericComponent = this.props.type === 'artist' ? Artist : Album;
    const onClick = this.props.type === 'artist'
        ? this.props.onArtistClick
        : this.props.type === 'album'
          ? this.props.onAlbumClick
          : this.props.onPlaylistClick;
    return (
      <div className="generic-container">
        <Spinner section loading={this.state.fetching}>
          <h1>{this.props.title}</h1>
          <InfiniteScroll
            className="browse-container"
            dataLength={this.state.items.length}
            next={this.fetchMore}
            hasMore={!!this.state.next}
            loader={<div className='loader' key={0}>Loading...</div>}
            endMessage={<p className="end-message">No more items to load</p>}
          >
            {this.state.items.map((item, index) => (
              <GenericComponent
              key={item.id || index}
              item={item}                
              onClick={onClick}onArtistClick={this.props.onArtistClick}
              />
            ))}
          </InfiniteScroll>
        </Spinner>
      </div>
    );
  };
}

export default withUiAction(Generic);
