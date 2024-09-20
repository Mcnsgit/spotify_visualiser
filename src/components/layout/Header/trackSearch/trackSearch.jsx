// src/components/layout/Header/trackSearch/Search.jsx

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import SpotifyWebApi from "spotify-web-api-js";
import TrackSearchResults from "./trackSearchResults";

const spotifyApi = new SpotifyWebApi();

export default function Search({ getInput }) {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (!search) {
      setSearchResults([]);
      return;
    }

    let cancel = false;

    spotifyApi.searchTracks(search)
      .then(data => {
        if (cancel) return;
        setSearchResults(
          data.tracks.items.map(track => {
            const smallestAlbumImage = track.album.images.reduce(
              (smallest, image) => {
                if (image.height < smallest.height) return image;
                return smallest;
              },
              track.album.images[0]
            );

            return {
              artist: track.artists[0].name,
              title: track.name,
              uri: track.uri,
              albumUrl: smallestAlbumImage.url,
            };
          })
        );
      })
      .catch(error => {
        console.error("Error fetching search results:", error);
      });

    return () => (cancel = true);
  }, [search]);

  const handleInputChange = (event) => {
    setSearch(event.target.value);
    getInput(event.target.value);
  };

  return (
    <div className="header-search">
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search for songs, albums, artists..."
          value={search}
          onChange={handleInputChange}
        />
      </div>
      {searchResults.map(track => (
        <TrackSearchResults
          key={track.uri}
          tracks={[track]}
          chooseTrack={(track) => console.log(track)}
        />
      ))}
    </div>
  );
}

Search.propTypes = {
  getInput: PropTypes.func.isRequired,
};``