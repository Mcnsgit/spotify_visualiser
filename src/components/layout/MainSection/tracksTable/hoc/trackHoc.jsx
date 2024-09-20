import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  removeTrack,
  addTrack,
  containsTrack
} from '../../trackList/libraryActions';

export default function(ComposedComponent) {
  class StatusHoc extends Component {
    state = {
      tracksStatus: []
    };

    componentDidMount() {
      this.fetchStatus();
    }

    componentDidUpdate(prevProps) {
      if (this.props.tracks !== prevProps.tracks) {
        this.fetchStatus();
      }
    }

    async fetchStatus() {
      const length = this.state.tracksStatus.length;
      const tracks = this.props.tracks
        .slice(length)
        .map(s => (s.track ? s.track.id : s.id));
      let i, j, temparray;
      for (i = 0, j = tracks.length; i < j; i += 25) {
        temparray = tracks.slice(i, i + 25);
        await this.props.containsTrack(temparray.join(',')).then(response => {
          this.setTracks(response);
        });
      }
    }

    setTracks(tracks) {
      this.setState(previousState => {
        return { tracksStatus: previousState.tracksStatus.concat(tracks) };
      });
    }

    changeTrackStatus = (index, newState) => {
      const tracks = this.state.tracksStatus;
      tracks[index] = newState;
      this.setState({ tracksStatus: tracks });
    };

    render = () => (
      <ComposedComponent
        changeTrackStatus={this.changeTrackStatus}
        tracksStatus={this.state.tracksStatus}
        {...this.props}
      />
    );
  }

  const mapDispatchToProps = dispatch => {
    return bindActionCreators(
      {
        removeTrack,
        containsTrack,
        addTrack
      },
      dispatch
    );
  };

  return connect(
    null,
    mapDispatchToProps
  )(StatusHoc);
}
