import React from "react";
import PropTypes from "prop-types";
import './trackSearchResults.scss';

function TrackSearchResults({ tracks, chooseTrack }) {
  return (
    <div className="track-search-results">
      <b>Search Results</b>
      {tracks.length === 0 ? (
        <p>No results found</p>
      ) : (
        tracks.map((track) => (
          <div
            key={track.uri}
            className="d-flex m-2 align-items-center"
            style={{ cursor: "pointer" }}
            onClick={() => chooseTrack(track)}
          >
            <img
              src={track.photo || "default-image-url.jpg"}
              alt="Album Art"
              style={{ height: "64px", width: "64px" }}
            />
            <div className="ml-3">
              <div>{track.name}</div>
              <div className="text-muted">{track.artists}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

TrackSearchResults.propTypes = {
  tracks: PropTypes.array.isRequired,
  chooseTrack: PropTypes.func.isRequired,
};

export default TrackSearchResults;
