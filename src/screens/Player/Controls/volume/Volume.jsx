// src/components/Player/Controls/volume/Volume.jsx
import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';


const SliderBar = styled.div`
  position: absolute;
  border-radius: 4px;
  background-color: #1db954;
  top: 0;
  bottom: 0;
  left: 0;
  width: ${({ value }) => `${value * 100}%`};
`;

const SliderHandle = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ffffff;
  transform: translate(-50%, -50%) scale(1);
  transition: transform 0.2s;
  top: 50%;
  left: ${({ value }) => `${value * 100}%`};
  &:hover {
    transform: translate(-50%, -50%) scale(1.3);
  }
`;

const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  input[type="range"] {
    width: 100px;
  }
`;

const Volume = ({ player }) => {
  const [volume, setVolume] = useState(50); // Default volume set to 50%

  const handleVolumeChange = useCallback((e) => {
    const newVolume = parseFloat(e.target.value) / 100;
    if (player && player.setVolume) {
      player.setVolume(newVolume);
    }
    setVolume(newVolume * 100); // Update local state as well
  }, [player]);

  useEffect(() => {
    if (player && player.getVolume) {
      setVolume(player.getVolume() * 100); // Set initial volume state from player
    }
  }, [player]);

  const toggleMute = () => {
    if (volume > 0) {
      if (player && player.setVolume) player.setVolume(0);
      setVolume(0);
    } else {
      if (player && player.setVolume) player.setVolume(0.5); // Restore to 50% volume
      setVolume(50);
    }
  };

  const VolumeIcon = ({ value }) => {
    let volumeClass;
    if (value > 50) {
      volumeClass = 'fa-volume-up';
    } else if (value === 0) {
      volumeClass = 'fa-volume-off';
    } else {
      volumeClass = 'fa-volume-down';
    }
    return <i className={`volume fa ${volumeClass}`} aria-hidden="true" onClick={toggleMute} />;
  };

  return (
    <VolumeContainer>
      <VolumeIcon value={volume} />
      <input
        type="range"
        min="0"
        max="100"
        onChange={handleVolumeChange}
        value={volume} // Use local state to manage volume
      />
    </VolumeContainer>
  );
};

Volume.propTypes = {
  player: PropTypes.shape({
    getVolume: PropTypes.func,
    setVolume: PropTypes.func
  })
};

export default Volume;