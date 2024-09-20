// src/components/Layout/Footer/Footer.jsx
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Player from "../../screens/Player/Player";
// import './Footer.scss';
import Volume from "../../screens/Player/Controls/volume/Volume";
import ProgressBar from "../../screens/Player/Controls/progressBar/progressBar";
import CurrentTrack from "../../screens/Player/Controls/CurrentTrack";
import PlayerControls from "../../screens/Player/Controls/playerControls/playerControls";
import Spinner from "../../components/spinner/spinner";
// import apiClient from "../../api/ApiClient";
// import { useLocation } from "react-router-dom";
// import AuthService from "../../services/AuthService";
// import { access } from "fs";
const FooterContainer = styled.footer`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 80px;
  background-color: #181818;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  z-index: 10;
`;

const Footer = () => {
  const [token, setToken] = useState(localStorage.getItem("access_token") || "");
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    if (!token) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

script.onload = () => {
      window.onSpotifyWebPlaybackSDKReady = () => {
        const spotifyPlayer = new window.Spotify.Player({
          name: "Spotify Web Player",
          getOAuthToken: cb => { cb(token); },
          volume: 0.5,
        });

        spotifyPlayer.addListener("ready", ({ device_id }) => {
          console.log("Ready with Device ID", device_id);
        });

        spotifyPlayer.addListener("not_ready", ({ device_id }) => {
          console.log("Device ID has gone offline", device_id);
        });

        spotifyPlayer.addListener("player_state_changed", state => {
          if (!state) return;
          setCurrentTrack(state.track_window.current_track);
          setIsPlaying(!state.paused);
        });

        spotifyPlayer.connect();
        setPlayer(spotifyPlayer);
        setLoading(false); // Stop loading after player is ready
      };
    };

    return () => {
      script.remove();
    };
  }, [token]);

  const togglePlayPause = () => {
    if (!player) return;
    if (isPlaying) {
      player.pause();
    } else {
      player.resume();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <FooterContainer className="footer">
      {loading ? (
        <Spinner loading={loading} />
      ) : (
        <>
          <Volume player={player} />
          <ProgressBar player={player} />
          <CurrentTrack player={player} />
          <PlayerControls
            player={player}
            isPlaying={isPlaying}
            togglePlayPause={togglePlayPause}
          />
        </>
      )}
    </FooterContainer>
  );
};

Footer.propTypes = {
  player: PropTypes.object,
};

export default Footer;
