
import React, { useEffect, useRef, useState, useContext} from "react";
import styled from "styled-components";
import axios from "axios";
import { useGlobalState }  from "../../context/GlobalStateContext";
import Header from "../../layout/Header/Header";
import SideMenu from "../../layout/SideMenu/leftSection";
import Footer from "../../layout/Footer/Footer";
import Body from "../../components/Body";
import { reducerCases } from "../../utils/Constants";
import AuthService from "../../services/AuthService";
import MainSection from "../../layout/MainSection/MainSection";
import PropTypes from 'prop-types';
import './body.scss'
import Sidebar from "../../layout/sidebar/index";
import instance from "../../utils/axios";
import SpotifyWebAPI  from "../../api/spotifyWebAPi";
import RightSideMenu from "../../layout/RightSideMenu/RightSideMenu";
import { useLocation } from "react-router-dom";
import Visualizer from "../../layout/MainSection/Visualiser/Visualiser";
import useAuth from "../../hooks/useAuth";
import apiClient ,{setClientToken} from "../../api/ApiClient";
import { useStateProvider } from "../../utils/StateProvider";
import WebPlayback from "../../spotify/WebSDKPlayer";

export function Dashboard() {
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  // const [deviceId, setDeviceId] = useState(null);  // Store the device ID for transferring playback
  const [player, setPlayer] = useState(null);      // Spotify player instance
  const token = AuthService.currentToken.access_token;

  const bodyRef = useRef();
  const [headerBackground, setHeaderBackground] = useState(false);
  const [view, setView] = useState("search");
  const [modal, setModal] = useState(false);

  // useEffect(() => {
  //   if (!token) return;

  //   const script = document.createElement("script");
  //   script.src = "https://sdk.scdn.co/spotify-player.js";
  //   script.async = true;
  //   document.body.appendChild(script);

  //   script.onload = () => {
  //     window.onSpotifyWebPlaybackSDKReady = () => {
  //       const spotifyPlayer = new window.Spotify.Player({
  //         name: "Spotify Web Player",
  //         getOAuthToken: cb => { cb(token); },
  //         volume: 0.5,
  //       });

  //       spotifyPlayer.addListener("ready", ({ device_id }) => {
  //         setDeviceId(device_id);
  //         console.log("Ready with Device ID", device_id);
  //       });

  //       spotifyPlayer.addListener("not_ready", ({ device_id }) => {
  //         console.log("Device ID has gone offline", device_id);
  //       });

  //       spotifyPlayer.addListener("player_state_changed", state => {
  //         if (!state) return;
  //         setCurrentTrack(state.track_window.current_track);
  //         setIsPlaying(!state.paused);
  //       });

  //       spotifyPlayer.connect();
  //       setPlayer(spotifyPlayer); // Store the player instance for future use
  //     };
  //   };

  //   return () => {
  //     script.remove(); // Remove script on component unmount
  //   };
  // }, [token]);

  // Transfer playback to the web player device
  const transferPlaybackToDevice = async () => {
    if (deviceId) {
      try {
        await axios.put(
          "https://api.spotify.com/v1/me/player",
          { device_ids: [deviceId], play: true },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Playback transferred to device:", deviceId);
      } catch (error) {
        console.error("Error transferring playback:", error);
      }
    }
  };
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
      };
    };

    return () => {
      script.remove();
    };
  }, [token]);


  const togglePlayPause = () => {
    if (!player) {
      console.log('Player is not ready');
      return;
    }

     
  if (isPlaying) {
    player.pause();
  } else {
    player.resume();
  }
  setIsPlaying(!isPlaying);
};


useEffect(() => {
  const fetchTracks = async () => {
    try {
      const res = await AuthService.getTracks(token);
      setTracks(res.items || []);
      setCurrentTrack(res.items[0]?.track || {});
    } catch (error) {
      console.error("Error fetching tracks", error);
    }
  };
  if (token) fetchTracks();
}, [token]);


  // useEffect(() => {
  //   setCurrentTrack(tracks[currentIndex]?.track);
  // }, [currentIndex, tracks]);

  return (
    <div className='h-screen bg-black'>
      <div className='h-[90%] flex'>
        <DashboardContainer>
          <Header headerBackground={headerBackground} token={token} className="header" />
          <SideMenuContainer className="side-menu-container">
            <SideMenu token={token} setView={setView} setModal={setModal} showModal={modal} className="side-menu" />
          </SideMenuContainer>
          <BodyContainer ref={bodyRef} className="body-container">
            <MainSection view={view} modal={modal} setModal={setModal} className="main-section">
              <Body view={view} token={token} className="body" />
              <Visualizer currentTrack={currentTrack} isPlaying={isPlaying} onPlayPauseClick={togglePlayPause} />
            </MainSection>
            <RightSideMenu />
          </BodyContainer>
          <Footer  accessToken={token}  />

        </DashboardContainer>
      </div>
    </div>
  );
}


const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;

const HeaderContainer = styled.div`
 .header {
  position: fixed;
  width: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100px;
  background: rgb(24, 24, 24);
  color: white;
  padding: 0 20px;
}

.header-title h1 {
  font-size: 20px;
  font-weight: 600;
}

.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  position: relative;
}

.details-container {
  display: flex;
  align-items: center;
  padding-right: 30px;
  background: rgb(24, 24, 24);
  gap: 10px;
}

.user-image {
  border-radius: 50%;
  height: 30px;
}

.username {
  margin-left: 10px;
}

.form {
    font-family: "BioRhyme", serif;
    width: 85%;
    height: 30%;
    background-color: rgba(0, 0, 0, 0.7);
    border: 5px solid #00b4d8;
    color: wheat;
    padding: 1em;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    float: center;
}

input[type="text"] {
    width: 80%;
    padding: 15px;
    margin: 10px 0;
    border: 2px solid #ddd;
    border-radius: 25px;
    outline: none;
    transition: all 0.3s ease-in-out;
    font-size: 16px;
  }
  
  input[type="text"]:focus {
    border-color: #00b4d8;
    box-shadow: 0 0 10px rgba(0, 180, 216, 0.5);
  }
  
  /* Submit button styling */
  button[type="submit"] {
    width: 50%;
    padding: 15px;
    margin: 10px 0;
    border: none;
    border-radius: 25px;
    background-color: #00b4d8;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
  }
  
  button[type="submit"]:hover {
    background-color: #0077b6;
    box-shadow: 0 0 10px rgba(0, 119, 182, 0.5);
  }
  
  input[type="submit"]:active {
    transform: scale(0.95);
  }
  
  input[type="submit"]:focus {
    outline: none;
    box-shadow: 0 0 10px rgba(0, 180, 216, 0.5);
  }

`;
const SideMenuContainer = styled.div`
  position: fixed;
  width: 250px;
  font-size: 20px;
  top: 20px;
  height: 100vh;
  background-color: black;
`;

const BodyContainer = styled.div`
  flex: 1;
  height: 100vh;
  margin-left: 300px;
  overflow-y: auto;
  background: linear-gradient(transparent, rgba(0, 0, 0, 1));
  background-color: rgb(32, 70, 60);
  &::-webkit-scrollbar {
    width: 0.7rem;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.6);
  }
`;
export default Dashboard;