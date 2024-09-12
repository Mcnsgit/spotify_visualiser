import React, {useState, useEffect,useContext} from 'react';
import { GlobalStateContext } from '../../context/GlobalStateContext';
import './mainSection.scss';
import Search from './search/search';
import Visualizer from './Visualiser/Visualiser';
import Sidebar from '../sidebar/index';
import Header from '../Header/Header';
import LeftSection from '../SideMenu/leftSection';
import { fetchUserPlaylists } from '../../api/api';
import Artists from './top/artists.jsx';
// import Browse from './browse/browser';
import Modal from './playlistModal/modal';
import TracksList from './trackList/trackList';
import Albums from './top/albums';
// import Recently from './recently/recently';
import Library from '../../screens/library/Library';
import Favorites from '../../screens/favorites/Favorites'; 
import { useLocation } from 'react-router-dom';
// import Recently from './recently/recently';

const MainSection = () => {
  const [view, setView] = useState('browse');
  const [showModal, setShowModal] = useState(false);
  const[isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = (playing) => {
    setIsPlaying(playing);
  };

  const handleSidebarClick = (view) => {
    if (view === 'playlist') {
      setShowModal(true);
    } else {
      setView(view);
    }
  };

  return (
   <div className="main-section">
      <Sidebar onSidebarClick={handleSidebarClick} />
      
      {/* Main Content based on view */}
      {view === 'search' && <Search />}
      {view === 'playlist' && <Modal />}
      {view === 'artists' && <Artists />}
      {view === 'albums' && <Albums />}
      {view === 'songs' && <TracksList />}
      {view === 'visualiser' && <Visualizer isPlaying={isPlaying} />}

      {/* Modal rendering */}
      {showModal && <Modal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default MainSection;
{/* <Modal />
  {view === 'search' && <Search />}
  {view === 'browse' && <Browse />}
  {view === 'browse' && <Browse />}
  {view === 'playlist' && <Playlist />}
          {view === 'songs' && <Songs />}
          {view === 'artist' && <Artist />}
          {view === 'albums' && <Albums />}
          {view === 'visualiser' && <Visualizer />}
        </div> */}
