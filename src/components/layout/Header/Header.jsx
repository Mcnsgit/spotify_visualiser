import React, { useState, useEffect,useContext } from "react";
import propTypes from 'prop-types';
import "./Header.scss";
import queryString from "query-string";
import UserDetails from "./userDetails/userDetails";
import { FaSearch } from "react-icons/fa";
import Search from "./trackSearch/trackSearch";
import TrackSearchResult from "./trackSearch/trackSearchResults";
import api from '../../../utils/axios';
import { AuthContext } from "../../../AuthContext";

export default function Header({ navBackground }) {
  const [results, setResults] = useState([]);
  const [searchType, setSearchType] = useState('track');
  const [query, setQuery] = useState('');
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const { access_token } = queryString.parse(window.location.hash.replace('#', '?'));
    if (access_token) {
      localStorage.setItem('token', access_token);
      setToken(access_token);
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  const fetchResults = async (type, query) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/search`, { 
        params: { q: query, type }, 
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = response.data[type + 's'].items || [];
      setResults(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (type, query) => {
    fetchResults(type, query);
  };

  const handleSubmit = () => {
    if (query.trim()) {
      handleSearch(searchType, query);
      setQuery('');
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    setResults([]);
  };

  const renderResultCard = (item) => {
    const imageUrl = item.album?.images?.[0]?.url || item.images?.[0]?.url;
    return (
      <a href={item.external_urls.spotify} target="_blank" rel="noopener noreferrer" key={item.id}>
        <div className="card">
          <img src={imageUrl} className="card-img-top" alt={item.name} />
          <div className="card-body">
            <h5 className="card-title">{item.name}</h5>
            {item.artists && <p className="card-text">By {item.artists.map(artist => artist.name).join(', ')}</p>}
          </div>
        </div>
      </a>
    );
  };

  return (
    <div className={`main-header ${navBackground ? "nav-background" : ""}`}>
      <div className="header-left">
        <h1>Spotify Visualizer</h1>
      </div>
      <div className="search-container">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <Search onSearch={handleSearch} />
        </div>
        <div className="row">
          {results.map(renderResultCard)}
        </div>
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