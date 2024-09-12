
import React from "react";
import "./progressBar.css";

const ProgressBar = ({ currentPercentage, duration, onScrub, onScrubEnd }) => {
  const formatDuration = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="progress-bar-container">
      <input
        type="range"
        value={duration ? currentPercentage : 0}
        step="1"
        min="0"
        max="100"
        className="progress-bar"
        onChange={(e) => onScrub(e.target.value * duration / 100)}
        onMouseUp={onScrubEnd}
        onKeyUp={onScrubEnd}
      />
      <div className="progress-time">
        <span>{formatDuration(currentPercentage * duration / 100)}</span>
        <span>{formatDuration(duration)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;