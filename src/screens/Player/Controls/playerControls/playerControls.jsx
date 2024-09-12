import React, { useState } from "react";
import styled from "styled-components";
import { BsFillPlayCircleFill, BsFillPauseCircleFill, BsShuffle } from "react-icons/bs";
import { CgPlayTrackNext, CgPlayTrackPrev } from "react-icons/cg";
import { FiRepeat } from "react-icons/fi";
import PropTypes from "prop-types";
import { IconContext } from "react-icons";

const PlayerControlsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  svg {
    color: #b3b3b3;
    transition: 0.2s ease-in-out;
    &:hover {
      color: white;
    }
  }
  .state {
    svg {
      color: white;
    }
  }
  .previous,
  .next,
  .state {
    font-size: 2rem;
  }
`;

const PlayerControls = ({ player }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.resume();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => player.nextTrack();
  const handlePrev = () => player.previousTrack();
  const handleShuffle = () => player.toggleShuffle();
  const handleRepeat = () => player.toggleRepeat();

  return (
    <IconContext.Provider value={{ size: "35px", color: "#C4D0E3" }}>
      <PlayerControlsContainer>
        <div className="previous" onClick={handlePrev}>
          <CgPlayTrackPrev />
        </div>
        <div className="state" onClick={handlePlayPause}>
          {isPlaying ? <BsFillPauseCircleFill /> : <BsFillPlayCircleFill />}
        </div>
        <div className="next" onClick={handleNext}>
          <CgPlayTrackNext />
        </div>
        <div className="shuffle" onClick={handleShuffle}>
          <BsShuffle />
        </div>
        <div className="repeat" onClick={handleRepeat}>
          <FiRepeat />
        </div>
      </PlayerControlsContainer>
    </IconContext.Provider>
  );
};

PlayerControls.propTypes = {
  player: PropTypes.object,
};

export default PlayerControls;
// // import {useState, useCallback, useEffect,useContext} from "react";
// // import styled from "styled-components";
// // import {
// //   BsFillPlayCircleFill,
// //   BsFillPauseCircleFill,
// //   BsShuffle,
// // } from "react-icons/bs";
// // import { CgPlayTrackNext, CgPlayTrackPrev } from "react-icons/cg";
// // import { FiRepeat } from "react-icons/fi";
// // import PropTypes from "prop-types"
// // import { useGlobalState } from "../../../../context/GlobalStateContext";
// // import { IconContext } from "react-icons";
// // import './playerControls.scss';

// // const PlayerControlsContainer = styled.div`
// //   display: flex;
// //   index:2;
// //   align-items: center;
// //   justify-content: center;
// //   gap: 2rem;
// //   svg {
// //     color: #b3b3b3;
// //     transition: 0.2s ease-in-out;
// //     &:hover {
// //       color: white;
// //     }
// //   }
// //   .state {
// //     svg {
// //       color: white;
// //     }
// //   }
// //   .previous,
// //   .next,
// //   .state {
// //     font-size: 2rem;
// //   }
// // `;
// // export default function PlayerControls ({ isPlaying,
// //   setIsPlaying,
// //   handleNext,
// //   handlePrev, 
// //   handleShuffle,
// //   handleRepeat})  {
// //     return (
// //       <IconContext.Provider value={{ size: "35px", color: "#C4D0E3" }}>
// //         <div className="controls-wrapper flex">
// //           <div className="action-btn flex" onClick={handlePrev}>
// //             <CgPlayTrackPrev />
// //           </div>
// //           <div
// //             className={
// //               isPlaying ? "play-pause-btn flex active" : "play-pause-btn flex"
// //             }
// //             onClick={() => setIsPlaying(!isPlaying)}
// //           >
// //             {isPlaying ? <BsFillPauseCircleFill /> : <BsFillPlayCircleFill />}
// //           </div>
// //           <div className="action-btn flex" onClick={handleNext}>
// //             <CgPlayTrackNext />
// //           </div>
// //           <div className="action-btn flex" onClick={handleShuffle}>
// //             <BsShuffle />
// //           </div>
// //           <div className="action-btn flex" onClick={handleRepeat}>
// //             <FiRepeat />
// //           </div>
// //         </div>
// //       </IconContext.Provider>
// //     );
// //   }

// import React, { useState, useEffect, useRef } from "react";
// import moment from "moment";
// import "./SongControls.css";

// const SongControls = () => {
//   const [timeElapsed, setTimeElapsed] = useState(0);
//   const [intervalId, setIntervalId] = useState(null);
//   const [songPlaying, setSongPlaying] = useState(false);
//   const [songPaused, setSongPaused] = useState(false);
//   const [songDetails, setSongDetails] = useState(null);
//   const [songs, setSongs] = useState([]);
//   const audioControlRef = useRef(null);

//   useEffect(() => {
//     if (songPlaying && timeElapsed === 0) {
//       clearInterval(intervalId);
//       calculateTime();
//     } else if (!songPlaying) {
//       clearInterval(intervalId);
//     }

//     return () => {
//       clearInterval(intervalId); // Cleanup on unmount
//     };
//   }, [songPlaying, timeElapsed]);

//   const calculateTime = () => {
//     const newIntervalId = setInterval(() => {
//       if (timeElapsed === 30) {
//         clearInterval(intervalId);
//         stopSong();
//       } else if (!songPaused) {
//         setTimeElapsed(prevTime => prevTime + 1);
//       }
//     }, 1000);

//     setIntervalId(newIntervalId);
//   };

//   const getSongIndex = () => {
//     return songs.findIndex(song => song.track === songDetails);
//   };

//   const nextSong = () => {
//     let currentIndex = getSongIndex();
//     currentIndex === songs.length - 1 ? audioControl(songs[0]) : audioControl(songs[currentIndex + 1]);
//   };

//   const prevSong = () => {
//     let currentIndex = getSongIndex();
//     currentIndex === 0 ? audioControl(songs[songs.length - 1]) : audioControl(songs[currentIndex - 1]);
//   };

//   const stopSong = () => {
//     setSongPlaying(false);
//     setTimeElapsed(0);
//     clearInterval(intervalId);
//   };

//   const pauseSong = () => {
//     setSongPaused(true);
//   };

//   const resumeSong = () => {
//     setSongPaused(false);
//     calculateTime();
//   };

//   const audioControl = (song) => {
//     setSongDetails(song.track);
//     setSongPlaying(true);
//     setSongPaused(false);
//     setTimeElapsed(0);
//     calculateTime();
//   };

//   const showPlay = songPaused ? "fa fa-play-circle-o play-btn" : "fa fa-pause-circle-o pause-btn";

//   return (
//     <div className="song-player-container">
//       <div className="song-details">
//         <p className="song-name">{songDetails ? songDetails.name : ""}</p>
//         <p className="artist-name">{songDetails ? songDetails.artists[0].name : ""}</p>
//       </div>

//       <div className="song-controls">
//         <div onClick={prevSong} className="reverse-song">
//           <i className="fa fa-step-backward reverse" aria-hidden="true" />
//         </div>

//         <div className="play-btn">
//           <i onClick={songPaused ? resumeSong : pauseSong} className={"fa play-btn " + showPlay} aria-hidden="true" />
//         </div>

//         <div onClick={nextSong} className="next-song">
//           <i className="fa fa-step-forward forward" aria-hidden="true" />
//         </div>
//       </div>

//       <div className="song-progress-container">
//         <p className="timer-start">{moment().minutes(0).second(timeElapsed).format("m:ss")}</p>
//         <div className="song-progress">
//           <div style={{ width: timeElapsed * 16.5 }} className="song-expired" />
//         </div>
//         <p className="timer-end">{moment().minutes(0).second(30 - timeElapsed).format("m:ss")}</p>
//       </div>
//     </div>
//   );
// };

// export default SongControls;
