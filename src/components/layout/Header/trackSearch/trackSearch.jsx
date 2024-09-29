// src/components/layout/Header/trackSearch/Search.jsx

import React, { useState, useEffect, useContext } from "react";

import { Container, Form } from "react-bootstrap"

import SpotifyWebApi from "spotify-web-api-js";
import TrackSearchResults from "./trackSearchResults";
import { AuthContext } from "../../../../AuthContext";

import "./Search.scss";

const spotifyApi = new SpotifyWebApi();

export default function Search({ onSearch }) {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('track');

  const handleSearch = () => {
    if (!query.trim()) return;
    onSearch(searchType, query);
    setQuery('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };



  
  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
      <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="form-select me-2"
            aria-label="Search type"
          >
            <option value="track">Tracks</option>
            <option value="artist">Artists</option>
            <option value="album">Albums</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="form-control me-2"
            aria-label="Search query"
          />
        <button onClick={handleSearch} className="btn btn-success">
          Search
        </button>
      
    </Container>
  )
  
  // {searchResults.map(track => (
  //   <TrackSearchResults
  //     track={track}
  //     key={track.uri}
  //     chooseTrack={chooseTrack}
  //   />
  // ))}
}