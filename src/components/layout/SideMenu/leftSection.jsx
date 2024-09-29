// LeftSection.jsx
import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import SidebarButton from "../sidebar/sidebarButton.jsx";
import { MdHomeFilled, MdSearch } from "react-icons/md";
import { FaGripfire, FaPlay } from "react-icons/fa";
import { IoLibrary } from "react-icons/io5";
import { FaSignOutAlt } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { AuthContext } from "../../../AuthContext";
import { useNavigate } from "react-router-dom";

const LeftSection = ({ setView, showModal, onPlaylistClick }) => {
  const [activeItem, setActiveItem] = useState("browse");
  const [playlists, setPlaylists] = useState([]);
  const { accessToken, setAccessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (accessToken) {
        try {
          const response = await fetch(
            "https://api.spotify.com/v1/me/playlists?limit=50&offset=0",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const data = await response.json();
          if (data.items) {
            setPlaylists(data.items);
          } else {
            console.error("Error fetching playlists:", data);
          }
        } catch (error) {
          console.error("Error fetching playlists:", error);
        }
      }
    };

    fetchPlaylists();
  }, [accessToken]);

  const handleLogout = () => {
    // Clear the access token and redirect to login
    setAccessToken(null);
    navigate("/login");
  };

  const handleSidebarClick = (item) => {
    if (item === "logout") {
      handleLogout();
    } else if (item === "newPlaylist") {
      showModal();
    } else {
      setView(item);
    }
    setActiveItem(item);
  };

  return (
    <LeftSectionContainer>
      <div className="top__links">
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

export default LeftSection;

// Styled Component
const LeftSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 200px;
  padding-top: 20px;
  overflow-y: auto;
  background-color: #121212;

  .top__links {
    flex: 1;
  }

  .library-header {
    padding: 20px;
    color: #fff;
  }
`;
