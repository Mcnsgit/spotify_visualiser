import React, { useState, useEffect } from "react";
import "./Player.scss";
import { useLocation } from "react-router-dom";
import AudioPlayer from "./audioPlayer";
import SongCard from "./playerComponents/songCard/index";
import Queue from "./playerComponents/queue/index";
import Widgets from "./playerComponents/widgets/index";
import instance from "../../utils/axios";
import { fetchPlaylistTracks } from "../../api/api"
import WebPlayback from "../../spotify/WebSDKPlayer";
import Volume from "./Controls/volume/Volume";
export default function Player() {
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [deviceId, setDeviceId] = useState(null);

  const location = useLocation();
  const accessToken = localStorage.getItem("access_token");

  // useEffect(() => {
  //   if (!accessToken) return;

  //   const script = document.createElement("script");
  //   script.src = "https://sdk.scdn.co/spotify-player.js";
  //   script.async = true;
  //   document.body.appendChild(script);

  //   script.onload = () => {
  //     window.onSpotifyWebPlaybackSDKReady = () => {
  //       const spotifyPlayer = new window.Spotify.Player({
  //         name: "Spotify Web Player",
  //         getOAuthToken: cb => { cb(accessToken); },
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
  // }, [accessToken]);

  // Transfer playback to the web player device
  // const transferPlaybackToDevice = async () => {
  //   if (deviceId) {
  //     try {
  //       await axios.put(
  //         "https://api.spotify.com/v1/me/player",
  //         { device_ids: [deviceId], play: true },
  //         { headers: { Authorization: `Bearer ${accessToken}` } }
  //       );
  //       console.log("Playback transferred to device:", deviceId);
  //     } catch (error) {
  //       console.error("Error transferring playback:", error);
  //     }
  //   }
  // };

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await AuthService.getTracks({
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { market: 'GB', limit: 50 },
        });
  
        // Check if response is valid and has the expected data structure
        if (res && res.data && Array.isArray(res.data.items)) {
          setTracks(res.data.items || []);
          setCurrentTrack(res.data.items[0]?.track || {});
        } else {
          console.error('Unexpected response format:', res);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Access token expired, refreshing...");
          await AuthService.refreshToken();
          // Retry fetching tracks after refreshing token
          fetchTracks();
        } else {
          console.error('Error fetching tracks:', error);
        }
      }
    };
  
    if (accessToken) fetchTracks();
  }, [accessToken]);

  useEffect(() => {
    setCurrentTrack(tracks[currentIndex]?.track);
  }, [currentIndex, tracks]);


  useEffect(() => {
    if (location.state?.id && accessToken) {
      fetchPlaylistTracks(location.state.id, accessToken).then(fetchedTracks => {
        if (fetchedTracks.length > 0) {
          setTracks(fetchedTracks);
          setCurrentTrack(fetchedTracks[0]);
        }
      });
    }
  }, [location.state, accessToken]);

  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = "https://sdk.scdn.co/spotify-player.js";
  //   script.async = true;
  //   document.body.appendChild(script);

  //   window.onSpotifyWebPlaybackSDKReady = () => {
  //     const spotifyPlayer = new window.Spotify.Player({
  //       name: "Spotify Web Player",
  //       getOAuthToken: cb => { cb(accessToken); },
  //       volume: 0.5
  //     });

  //     spotifyPlayer.addListener("ready", ({ device_id }) => {
  //       setDeviceId(device_id);
  //       console.log("Device ID:", device_id);
  //     });

  //     spotifyPlayer.addListener("not_ready", ({ device_id }) => {
  //       console.log("Device ID has gone offline", device_id);
  //     });

  //     spotifyPlayer.addListener("player_state_changed", state => {
  //       if (!state) return;
  //       setCurrentTrack(state.track_window.current_track);
  //       setIsPlaying(!state.paused);
  //     });

  //     spotifyPlayer.connect();
  //     setPlayer(spotifyPlayer);
  //   };
  // }, [accessToken]);

  const handlePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pause();
      } else {
        player.resume();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (player) {
      player.nextTrack();
      setCurrentIndex((prevIndex) => (prevIndex < tracks.length - 1 ? prevIndex + 1 : 0));
    }
  };

  const handlePrev = () => {
    if (player) {
      player.previousTrack();
      setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : tracks.length - 1));
    }
  };

  return (
    <div className="player-container">
      <WebPlayback  accessToken={accessToken}  deviceId={deviceId}  player={player} 
       isPlaying={isPlaying}>
      <div className="left-player-body">
      <SongCard album={currentTrack?.album || { images: [{ url: '' }] }}  />
      <WebPlayback token={token} />
        <AudioPlayer
          audioSrc={currentTrack?.preview_url}
          currentTrack={currentTrack}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          total={tracks}
          onPlayPause={handlePlayPause}
          isPlaying={isPlaying}
          player={player}
          onNext={handleNext}
          onPrev={handlePrev}
          />
          {player && (<Volume player={player} setVolume={setVolume} />
        )}

      </div>
      <Widgets artistID={currentTrack?.album?.artists[0]?.id} />
      <div className="right-player-body">
        <Queue tracks={tracks} setCurrentIndex={setCurrentIndex} />
      </div>
          </WebPlayback>
    </div>)}