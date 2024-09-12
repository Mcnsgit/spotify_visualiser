import React, { Component } from 'react';

import axios from '../../../../../../utils/axios';
import Spinner from '../../../../../common/spinner/spinner';

import withStatus from '../../../../../../hoc/statusHoc';
import PlaylistTable from '../../../../../tracksTable/playlistTable/playlistTable';

class TracksSearcher extends Component {
  state = {
    items: [],
    fetching: true
  };

  playTracks = (context, offset) => {
    const tracks = this.state.items.slice(offset).map(s => s.uri);
    axios.put('/me/player/play', { uris: tracks });
  };

  componentDidMount() {
    axios.get(`/search?q=${this.props.query}&type=track`).then(response => {
      this.setState({
        fetching: false,
        items: response.data.tracks.items,
        next: response.data.tracks.next
      });
    });
  }

  fetchMore = () => {
    if (this.state.next) {
      axios.get(this.state.next).then(response => {
        this.setState(prevState => {
          return {
            items: [...prevState.items, ...response.data.tracks.items],
            next: response.data.tracks.next
          };
        });
      });
    }
  };

  render = () => {
    return (
      <div className="generic-container">
        <Spinner section loading={this.state.fetching}>
          <PlaylistTable
            removeDate={true}
            fetchMoreTracks={this.fetchMore}
            playTrack={this.playTracks}
            pauseTrack={this.props.pauseTrack}
            current={this.props.currentTrack}
            playing={this.props.playing}
            more={this.state.next ? true : false}
            tracks={this.state.items}
          />
        </Spinner>
      </div>
    );
  };
}

export default withStatus(TracksSearcher);
