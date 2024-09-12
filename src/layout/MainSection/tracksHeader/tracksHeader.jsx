import React from 'react';

import './tracksHeader.css';

const simpleHeader = props => (
  <div>
    <h3 className="header-title">{props.title}</h3>
    <button
      onClick={props.playing ? props.pauseTrack : props.playTrack}
      className="main-pause-play-btn"
    >
      {props.playing ? 'PAUSE' : 'PLAY'}
    </button>
  </div>
);

export default simpleHeader;
