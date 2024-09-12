
import React, { useState, useEffect } from 'react';
import useAudioContext from './useAudioContext';
import propTypes from 'prop-types';

import Button from '../../Controls/controlButon';
import {
  IoPlayBackSharp,
  IoPlayForwardSharp,
  IoPlaySkipBackSharp,
  IoPlaySkipForwardSharp,
  IoPlaySharp,
  IoPauseSharp,
} from 'react-icons/io5';


const AudioControls = ({ 
  spotifyPlayer, 
  isPlaying, 
  onPlay, 
  onPause, 
  onNext, 
  onPrevious 
}) => {
  if (!spotifyPlayer) {
    return <div>Connecting to Spotify...</div>;
  }

  return (
    <div className="track-control">
      <Button
        onClick={() => shuffle(!shuffleActive)}
        className={`shuffle-track${shuffleActive ? ' active' : ''}`}
        icon={<IoShuffleOutline />}
      />
      <button onClick={onPrevious} disabled={!spotifyPlayer}>Previous</button>
      {isPlaying ? (
        <button onClick={onPause} disabled={!spotifyPlayer}>Pause</button>
      ) : (
        <button onClick={onPlay} disabled={!spotifyPlayer}>Play</button>
      )}
      <button onClick={onNext} disabled={!spotifyPlayer}>Next</button>

      <Button
        onClick={() => repeatContext(repeatActive ? 'off' : 'context')}
        className={`repeat-track${repeatActive ? ' active' : ''}`}
        icon={<IoRepeatOutline />}
      />
    </div>
  );
};

export default AudioControls;