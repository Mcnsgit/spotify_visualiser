import React, { useState, useEffect, useContext, useReducer, useCallback, useMemo } from "react";
import propTypes from "prop-types";
import withUiActions from "../../hoc/uiHoc.jsx";
import styled from "styled-components";
import SidebarButton from "../sidebar/sidebarButton.jsx";
import axios from "axios";
import "./leftSection.scss";  
import { MdHomeFilled, MdSearch } from "react-icons/md";
import { FaGripfire, FaPlay } from "react-icons/fa";
import { IoLibrary } from "react-icons/io5";
import { FaSignOutAlt } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import Playlists from "../../screens/Player/Playlist.jsx";
import AuthService from '../../services/AuthService.jsx';
import { reducerCases } from '../../utils/Constants.jsx';
import Sidebar from "../sidebar/index.jsx";
import {api} from "../../api/Spotify.jsx";
import { useNavigate } from "react-router-dom";

const LeftSection = ({ token, setView, setModal, onPlaylistClick, showModal }) => {
  const [activeItem, setActiveItem] = useState("browse");
  const [playlists, setPlaylists] = useState([]);

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  const navigate = useNavigate();

  const fetchPlaylists = async () => {
    if (token) {
      try {
        const response = await api.get("me/playlists", {
          limit: 50,
          offset: 0,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlaylists(response.data.items);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    }
  };

  useEffect(() => {
    fetchPlaylists();
  } , [token]);

  const renderPlaylists = () => {
    return (
      <Playlists
        token={token}
        onPlaylistClick={onPlaylistClick}
      />
    );
  };

  const handleSidebarClick = (item) => {
    if (item === "newPlaylist") {
      showModal();
    } else {
      setView(item);
    }
    setActiveItem(item);
  };
  

  return (

    <LeftSectionContainer>
      <div className="top__links flex">
        <SidebarButton
            title="Search"
            onClick={() => handleSidebarClick("search")}
            icon={<MdSearch />}
            active={activeItem === "search"}
            />
        <SidebarButton
          title="Home"
          onClick={() => handleSidebarClick("dashboard")}
          icon={<MdHomeFilled />}
          active={activeItem === "dashboard"}
        />
      
        <SidebarButton 
          title="Feed"
          onClick={() => handleSidebarClick("browse")}
          icon={<MdSpaceDashboard />}
          active={activeItem === "browse"}
          />
          <SidebarButton
            title="Liked Songs"
  onClick={() => handleSidebarClick("savedSongs")}
  icon={<FaGripfire />}
  active={activeItem === "savedSongs"}
  />
        <SidebarButton
          title="My Library"
          onClick={() => handleSidebarClick("userPlaylists")}
          icon={<IoLibrary />}
          active={activeItem === "userPlaylists"}
          />
        <SidebarButton
          title="Create Playlist"
          onClick={() => handleSidebarClick("newPlaylist")}
          icon={<FaPlay />}
          active={activeItem === "newPlaylist"}
          />
        <SidebarButton
          title="Visualizer"
          onClick={() => handleSidebarClick("visualizer")}
          icon={<FaGripfire />}
          active={activeItem === "visualizer"}
          />
        <h3 className="library-header">Playlists</h3>
        {playlists.map((playlist) => (
          <SidebarButton
          key={playlist.id}
          title={playlist.name}
          onClick={() => {
            setActiveItem(playlist.id);
            onPlaylistClick(playlist.id);
          }}
          active={activeItem === playlist.id}
          />
        ))}
        </div>

      <SidebarButton
        title="Sign Out"
        onClick={() => handleSidebarClick("logout")}
        icon={<FaSignOutAlt />}
      />
    </LeftSectionContainer>
  );
};

LeftSection.propTypes = {
  setView: propTypes.func.isRequired,
  setModal: propTypes.func.isRequired,
  token: propTypes.string,
  onPlaylistClick: propTypes.func,
  showModal: propTypes.func.isRequired,
};

export default LeftSection;

const LeftSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 200px;
  padding-top: 20px;
  overflow-y: scroll;
  background-color: #121212;

  .top__links {
    flex: 1;
  }

  .library-header {
    padding: 20px;
    color: #fff;
  }

  .user-playlist-container {
    padding-left: 10px;
  }
`;