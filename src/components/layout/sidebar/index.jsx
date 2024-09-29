// Sidebar.jsx
import React, { useContext } from "react";
import SidebarButton from "./sidebarButton";
import { MdFavorite, MdHomeFilled, MdSpaceDashboard } from "react-icons/md";
import { FaGripfire, FaPlay, FaSignOutAlt } from "react-icons/fa";
import { IoLibrary } from "react-icons/io5";
import { AuthContext } from "../../../AuthContext";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ onSidebarClick }) {
  const { setAccessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setAccessToken(null);
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div>
        <SidebarButton
          title="Home"
          onClick={() => onSidebarClick("dashboard")}
          icon={<MdHomeFilled />}
        />
        <SidebarButton
          title="Feed"
          onClick={() => onSidebarClick("browse")}
          icon={<MdSpaceDashboard />}
        />
        <SidebarButton
          title="Visualizer"
          onClick={() => onSidebarClick("visualizer")}
          icon={<FaGripfire />}
        />
        <SidebarButton
          title="Player"
          onClick={() => onSidebarClick("player")}
          icon={<FaPlay />}
        />
        <SidebarButton
          title="Favorites"
          onClick={() => onSidebarClick("favorites")}
          icon={<MdFavorite />}
        />
        <SidebarButton
          title="Library"
          onClick={() => onSidebarClick("library")}
          icon={<IoLibrary />}
        />
        <SidebarButton
          title="Create Playlist"
          onClick={() => onSidebarClick("newPlaylist")}
          icon={<FaPlay />}
        />
      </div>
      <SidebarButton
        title="Sign Out"
        onClick={handleLogout}
        icon={<FaSignOutAlt />}
      />
    </div>
  );
}
