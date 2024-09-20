import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('');
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    if (query) {
      fetchSearchData(query);
    } else {
      resetResults();
    }
  }, [query]);

  const fetchSearchData = async (searchQuery) => {
    try {
      const response = await axios.get('/api/search', {
        params: { q: searchQuery }
      });
      setArtists(response.data.artists || []);
      setTracks(response.data.tracks || []);
      setPlaylists(response.data.playlists || []);
      setAlbums(response.data.albums || []);
    } catch (error) {
      console.error('Error fetching search data:', error);
    }
  };

  const resetResults = () => {
    setArtists([]);
    setTracks([]);
    setPlaylists([]);
    setAlbums([]);
  };

  useEffect(() => {
    setMode('');
  }, [query]);

  const results = tracks.length || playlists.length || artists.length || albums.length;

  const renderIndex = () => (
    <Message
      icon="fa-search"
      title="Search Spotify"
      description="Find your favorite tracks, artists, albums, and playlists."
    />
  );

  const renderNoResults = () => (
    <Message
      icon="fa-flag-o"
      title={`No results found for "${query}"`}
      description="Please make sure your words are spelled correctly or use less or different keywords."
    />
  );

  const renderResults = () => (
    <div className="table-container">
      <div className="results-table">
        <div className="search-results">
          {tracks.length ? (
            <ResultGroup
              items={tracks}
              onClick={() => {}}
              changeMode={setMode}
              type="Tracks"
            />
          ) : null}
          {artists.length ? (
            <ResultGroup
              changeMode={setMode}
              items={artists}
              onClick={() => {}}
              type="Artists"
            />
          ) : null}
          {albums.length ? (
            <ResultGroup
              changeMode={setMode}
              items={albums}
              onClick={() => {}}
              type="Albums"
            />
          ) : null}
          {playlists.length ? (
            <ResultGroup
              changeMode={setMode}
              items={playlists}
              onClick={() => {}}
              type="Playlists"
            />
          ) : null}
        </div>
      </div>
    </div>
  );

  const renderAllResults = () => {
    let type;
    switch (true) {
      case mode === 'Artists':
        type = 'artist';
        break;
      case mode === 'Albums':
        type = 'album';
        break;
      case mode === 'Playlists':
        type = 'playlist';
        break;
      default:
        type = 'track';
        break;
    }

    return (
      <div className="all-results">
        <h2>
          Showing {mode} for "{query}"
        </h2>
        {type === 'track' ? (
          <TrackSearch query={query} />
        ) : (
          <Generic type={type} url={`/search?q=${query}&type=${type}`} />
        )}
      </div>
    );
  };

  return (
    <div className="search-container">
      {mode && renderAllResults()}
      {!mode && !query && renderIndex()}
      {!mode && query && results ? renderResults() : null}
      {query && !results && renderNoResults()}
    </div>
  );
};

const Message = ({ icon, title, description }) => (
  <div className="message-container">
    <i className={`fa ${icon}`} aria-hidden="true"></i>
    <h2>{title}</h2>
    <p>{description}</p>
  </div>
);

const ResultGroup = ({ items, onClick, changeMode, type }) => (
  <div className="result-group">
    <h3>{type}</h3>
    <ul>
      {items.map((item, index) => (
        <li key={index} onClick={() => onClick(item)}>
          {item.name}
        </li>
      ))}
    </ul>
    <button onClick={() => changeMode(type)}>View All {type}</button>
  </div>
);

const TrackSearch = ({ query, tracks }) => (
  <div>
    <h2>Tracks for "{query}"</h2>
    <ul>
      {tracks.length > 0 ? (
        tracks.map((track, index) => (
          <li key={index}>
            <p>{track.name}</p>
            <p>{track.artist}</p>
            <p>{track.album}</p>
          </li>
        ))
      ) : (
        <p>No tracks found for "{query}".</p>
      )}
    </ul>
    <button>View All Tracks</button>
  </div>
);
const Generic = ({ type, items }) => (
  <div>
    <h2>{type} results</h2>
    <ul>
      {items.length > 0 ? (
        items.map((item, index) => (
          <li key={index}>
            <p>{item.name}</p>
            {type === 'Artists' && <p>{item.genre}</p>}
            {type === 'Albums' && <p>{item.artist}</p>}
            {type === 'Playlists' && <p>{item.tracks} tracks</p>}
          </li>
        ))
      ) : (
        <p>No {type.toLowerCase()} found.</p>
      )}
    </ul>
  </div>
);


export default Search;

  