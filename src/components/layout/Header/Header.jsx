import React, { useState, useEffect } from "react";
import propTypes from 'prop-types';
import "./Header.scss";
import UserDetails from "./userDetails/userDetails";
import { FaSearch } from "react-icons/fa";
import Search from "./trackSearch/trackSearch";
import TrackSearchResult from "./trackSearch/trackSearchResults";
import api from '../../../utils/axios';

export default function Header({ navBackground }) {
  const [input, setInput] = useState(""); 
  const [tracks, setTracks] = useState([]);
  const { profileImage, displayName } = useState();
  
  const handleSearchInput = (inputValue) => {
    setInput(inputValue);
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!input) {
        setTracks([]); // Ensure tracks is always an array
        return;
      }
      try {
        const results = await api.search(input);
        setTracks(results || []);  // Ensure results is an array
      } catch (error) {
        console.error("Error fetching search results:", error);
        setTracks([]); // Set to empty array on error
      }
    };

    fetchSearchResults();
  }, [input]);

  return (
    <div className={`main-header ${navBackground ? "nav-background" : ""}`}>
      <div className="header-left">
        <h1>Spotify Visualizer</h1>
      </div>
      <div className="search-container">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <Search getInput={handleSearchInput} />
        </div>
        {input && tracks.length > 0 && (
          <TrackSearchResult tracks={tracks} chooseTrack={(track) => console.log(track)} />
        )}
      </div>
      <div className="user-profile">
        <UserDetails />
      </div>
    </div>
  );
}

Header.propTypes = {
  navBackground: propTypes.bool,
};
