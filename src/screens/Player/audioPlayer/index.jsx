import React, { useState, useRef, useEffect } from "react";
import "./audioPlayer.css";
import Controls from "./controls";
import ProgressBar from "../Controls/progressBar/progressBar"; 
import Volume from "../Controls/volume/Volume";
import detailSection from "./trackInfo"; // Corrected import statement
import withPlayerHoc from "../../../hoc/playerHoc";
const AudioPlayer = ({ currentTrack, isPlaying, player, onPlayPause, onNext, onPrev }) => {
  const [trackProgress, setTrackProgress] = useState(0);
  const [isPlayerReady, setIsPlayerReady] = useState(false); // Track if player is ready

  // Function to safely handle resume
  const safeResume = () => {
    if (player && player.resume) {
      player.resume().catch(err => console.error("Failed to resume playback:", err));
    } else {
      console.warn("Player is not ready to resume");
    }
  };

  useEffect(() => {
    const checkPlayerState = () => {
      if (player && player.getCurrentState) {
        player.getCurrentState()
          .then(state => {
            if (state) {
              setTrackProgress(state.position / state.duration);
            } else {
              console.warn("Player state is null or not ready.");
            }
          })
          .catch(error => {
            console.error("Error fetching player state:", error);
          });
      } else {
        console.warn("Player is not initialized");
      }
    };

    // Polling the player state every second
    const interval = setInterval(() => {
      if (isPlayerReady) {
        checkPlayerState();
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [player, isPlayerReady]);

  // Use effect to track when the player is ready
  useEffect(() => {
    if (player) {
      player.addListener('ready', () => {
        console.log('Player is ready');
        setIsPlayerReady(true); // Player is ready
      });
      player.addListener('not_ready', () => {
        console.log('Player is not ready');
        setIsPlayerReady(false); // Player is not ready
      });
    }

    // Clean up listeners on unmount
    return () => {
      if (player) {
        player.removeListener('ready');
        player.removeListener('not_ready');
      }
    };
  }, [player]);

  return (
    <div className="player-container">
      {currentTrack?.id && (
        <detailSection
          trackName={currentTrack.name}
          album={currentTrack.album.uri.split(':')[2]}
          artists={currentTrack.artists}
        />
      )}
      <div className="player-controls">
        <Controls
          isPlaying={isPlaying}
          onPlayPauseClick={() => {
            if (isPlayerReady) {
              onPlayPause();
            } else {
              console.warn("Player is not ready to play/pause");
            }
          }}
          handleNext={onNext}
          handlePrev={onPrev}
        />
        <div className="progress-container">
          <ProgressBar
            className="progress-bar"
            currentPercentage={trackProgress}
            onScrub={() => {}}
            onScrubEnd={() => {}}
          />
        </div>
      </div>
      <div className="volume-container">
        <Volume player={player} />
      </div>
    </div>
  );
};

export default AudioPlayer;