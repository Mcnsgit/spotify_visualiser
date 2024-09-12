import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../Header.scss";
import TrackSearchResults from "./trackSearchResults";
import AuthService from "../../../services/AuthService";

export default function Search({ getInput }) {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleInputChange = (event) => {
    setSearch(event.target.value);
    getInput(event.target.value);
  };

  useEffect(() => {
    if (!search) {
      setSearchResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        const results = await AuthService.search(search);
        setSearchResults(results);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [search]);

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
      <TrackSearchResults tracks={searchResults} chooseTrack={(track) => console.log(track)} />
    </div>
  );
}

Search.propTypes = {
  getInput: PropTypes.func.isRequired,
};
