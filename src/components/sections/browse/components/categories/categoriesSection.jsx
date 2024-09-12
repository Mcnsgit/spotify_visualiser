import React, { useEffect, Fragment, useContext, useState } from 'react';
import { GlobalStateContext } from '../../../../../context/GlobalStateContext';
import InfiniteScroll from 'react-infinite-scroller';
import withUiActions from '../../../../../hoc/uiHoc';
import {
  fetchGenres,
  fetchNewReleases,
  fetchFeatured,
  fetchCharts,
  fetchMoreCategories,
  fetchPlaylistForCategory
} from '../../../../../store/actions/browseActions';

import Album from '../../../../items/album';
import Genre from '../items/genre';
import Playlist from '../items/playlist';

const Categories =({ active, onAlbumClick, onArtistClick, onPlaylistClick }) => {
  const [state, dispatch] = useContext(GlobalStateContext);
  const [categories, setCategories] = useState([]);

}
useEffect(() => {
  fetchGenres(dispatch).then(data => setCategories(data || []));
}, [dispatch]);

// Fetch categories based on the active tab
useEffect(() => {
  if (Categories.length === 0 || active !== state.activeCategory) {
    switch (active) {
      case 'New Releases':
        fetchNewReleases(dispatch).then(data => setCategories(data || []));
        break;
      case 'Featured':
        fetchFeatured(dispatch).then(data => setCategories(data || []));
        break;
      case 'Charts':
        fetchCharts(dispatch).then(data => setCategories(data || []));
        break;
      default:
        fetchGenres(dispatch).then(data => setCategories(data || []));
        break;
    }
  }
}, [active, Categories.length, dispatch]);

const renderCategories = () => {
  if (!categories || categories.length === 0) return null; // Safeguard against undefined or empty categories

  switch (active) {
    case 'New Releases':
      return categories.map(item => (
        <Album
          item={item}
          key={item.id}
          onClick={() => onAlbumClick(item.id)}
          onArtistClick={onArtistClick}
        />
      ));
    case 'Genres & Moods':
      return categories.map(item => (
        <Genre
          item={item}
          onClick={() => {
            fetchPlaylistForCategory(item.id, dispatch).then(data => setCategories(data || []));
            dispatch({ type: 'SET_ACTIVE_CATEGORY', payload: item.name });
          }}
          key={item.id}
        />
      ));
    case 'Charts':
      const charts = categories.filter(c => c.name.includes('50'));
      const otherCategories = categories.filter(c => !c.name.includes('50'));
      return (
        <Fragment>
          {charts.map(item => (
            <Playlist
              chart
              item={item}
              key={item.id}
              onClick={() => onPlaylistClick(item.id)}
            />
          ))}
          <div className="toplists">
            <h3 className="browse-title">Top Lists</h3>
          </div>
          {otherCategories.map(item => (
            <Playlist
              item={item}
              key={item.id}
              onClick={() => onPlaylistClick(item.id)}
            />
          ))}
        </Fragment>
      );
    default:
      return categories.map(item => (
        <Playlist
          item={item}
          key={item.id}
          onClick={() => onPlaylistClick(item.id)}
        />
      ));
  }
};

return (
  <InfiniteScroll
    dataLength={categories.length}
    next={() => fetchMoreCategories(dispatch).then(data => setCategories(prev => [...prev, ...(data || [])]))}
    loader={<div className="loader" key={0} />}
  >
    <ul className="browse-container">{renderCategories()}</ul>
  </InfiniteScroll>
);


export default Categories;