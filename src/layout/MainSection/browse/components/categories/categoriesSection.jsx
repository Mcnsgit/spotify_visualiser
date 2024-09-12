import React, { useEffect, Fragment, useContext, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import withUiActions from '../../../../../hoc/uiHoc';
import {
  fetchGenres,
  fetchNewReleases,
  fetchFeatured,
  fetchCharts,
  fetchMoreCategories,
  fetchPlaylistForCategory
} from '../../browseActions';
import { GlobalStateContext } from '../../../../../context/GlobalStateContext';

import Album from '../../../tracksTable/items/album';
import Genre from '../items/genre';
import Playlist from '../items/playlist';

const Categories = ({ active, onAlbumClick, onArtistClick, onPlaylistClick }) => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchGenres(dispatch).then(setCategories);
  }, [dispatch]);

  useEffect(() => {
    // Remove dependency on state.activeCategory
    if (categories.length === 0 || active !== state.activeCategory) {
      switch (active) {
        case 'New Releases':
          fetchNewReleases(dispatch).then(setCategories);
          break;
        case 'Featured':
          fetchFeatured(dispatch).then(setCategories);
          break;
        case 'Charts':
          fetchCharts(dispatch).then(setCategories);
          break;
        default:
          fetchGenres(dispatch).then(setCategories);
          break;
      }
    }
  }, [active, categories.length, dispatch]);

  const renderCategories = () => {
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
                fetchPlaylistForCategory(item.id, dispatch).then(setCategories);
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
        next={() => fetchMoreCategories(dispatch).then(setCategories)}
        hasMore={state.categories.next !== null}
        loader={<div className="loader" key={0} />}
      >
        <ul className="browse-container">{renderCategories()}</ul>
      </InfiniteScroll>
    );
  };
  
  export default Categories;