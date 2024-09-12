import React, {memo, useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useStateProvider } from "../../../utils/StateProvider";
import { reducerCases } from "../../../utils/Constants";
import PropTypes from "prop-types";
import AuthService from "../../../services/AuthService";
import { useGlobalState } from "../../../context/GlobalStateContext";


const CurrentTrackContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  .track-image {
    width: 50px;
    height: 50px;
  }
  .track-info {
    display: flex;
    flex-direction: column;
    span:first-child {
      color: white;
    }
    span:last-child {
      color: #b3b3b3;
    }
  }
`;

const CurrentTrack = ({ player }) => {
  const [currentTrack, setCurrentTrack] = useState(null);

useEffect(() => {
  if (!player) return; // Ensure player is available

  const updateTrack = (state) => {
    if (state) {
      setCurrentTrack(state.track_window.current_track);
    }
  };

  player.addListener('player_state_changed', updateTrack);

  return () => {
    player.removeListener('player_state_changed', updateTrack);
  };
}, [player]);

if (!currentTrack) {
  return <div>No track is playing</div>;
}

return (
  <div>
    <img src={currentTrack.album.images[0].url} alt="Album cover" />
    <div>{currentTrack.name}</div>
    <div>{currentTrack.artists.map((artist) => artist.name).join(', ')}</div>
  </div>
);
};

export default CurrentTrack;