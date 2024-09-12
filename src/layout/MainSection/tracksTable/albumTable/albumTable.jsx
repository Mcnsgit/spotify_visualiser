import React, { Component } from 'react';
import propTypes from 'prop-types';
import '../../sections/artist/components/popular/popular.css';
import './albumTable.css';

import Track from '../items/track';
import withTracksStatus from '../hoc/trackHoc';

class Album extends Component {
  groupByCD() {
    return this.props.tracks.reduce((memo, x) => {
      if (!memo[x['disc_number']]) {
        memo[x['disc_number']] = [];
      }
      memo[x['disc_number']].push(x);
      return memo;
    }, []);
  }

  renderTracks() {
    const lastTrack = this.props.tracks[this.props.tracks.length - 1];
    const count = lastTrack ? lastTrack.disc_number : 1;

    if (count > 1) {
      const cds = this.groupByCD();

      const index = this.props.tracks.map(t => t.id);

      return cds.map((cd, i) => (
        <div key={i}>
          <div className="cd-header">
            <i className="fa fa-dot-circle-o" />
            {` ${i}`}
          </div>
          {this.renderSimple(cd, index)}
        </div>
      ));
    }

    return this.renderSimple(this.props.tracks);
  }

  renderSimple = (cd, index = null) =>
    cd.map((t, i) => (
      <Track
        contains={this.props.tracksStatus[i]}
        item={t}
        key={i}
        index={i + 1}
        isAlbum={true}
        offset={index ? index.indexOf(t.id) : i}
        uri={this.props.uri}
        id={t.id}
        current={this.props.currentTrack}
        playing={this.props.playing}
        pauseTrack={this.props.pauseTrack}
        playTrack={this.props.playTrack}
        onAdd={() => {
          this.props.changeTrackStatus(i, true);
          this.props.addTrack(t.id);
        }}
        onDelete={() => {
          this.props.changeTrackStatus(i, false);
          this.props.removeTrack(t.id);
        }}
      />
    ));

  render() {
    return (
      <div className="album-container">
        <div className="track-header-container">
          <div className="track-number-header">
            <p>#</p>
          </div>{' '}
          <div className="track-number-header" />
          <div className="track-title-header">
            <p>Title</p>
          </div>
          <div className="track-artist-header">
            <p>Artists</p>
          </div>
          <div className="explicit-header" />
          <div className="track-length-header">
            <i className="fa fa-clock-o" aria-hidden="true" />
          </div>
        </div>
        {this.renderTracks()}
      </div>
    );
  }
}
Album.propTypes = {
  tracks: propTypes.array,
  
}
export default withTracksStatus(Album);
