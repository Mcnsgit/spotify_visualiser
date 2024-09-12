import React, { useState, useEffect } from "react";
import "./sidebar.css";
import SidebarButton from "./sidebarButton";
import { MdFavorite } from "react-icons/md";
import { FaGripfire, FaPlay } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { IoLibrary } from "react-icons/io5";
import { MdSpaceDashboard } from "react-icons/md";
import { MdHomeFilled } from "react-icons/md";
import apiClient from "../../api/ApiClient";

export default function Sidebar({onSidebarClick}) {
  return (
    <div className="sidebar">
           <div>
            <SidebarButton title="Home" onClick={() => onSidebarClick('dashboard')} icon={<MdHomeFilled />} />
        <SidebarButton title="Feed" onClick={() => onSidebarClick('browse')} icon={<MdSpaceDashboard />} />
        <SidebarButton title="Visualizer" onClick={() => onSidebarClick('visualiser')} icon={<FaGripfire />} />
        <SidebarButton title="Player" onClick={() => onSidebarClick('player')} icon={<FaPlay />} />
        <SidebarButton title="Favorites" onClick={() => onSidebarClick('favorites')} icon={<MdFavorite />} />
        <SidebarButton title="Library" onClick={() => onSidebarClick('library')} icon={<IoLibrary />} />
        <SidebarButton title="Create Playlist" onClick={() => onSidebarClick('newPlaylist')} icon={<FaPlay />} />
      </div>
      <SidebarButton title="Sign Out" onClick={() => onSidebarClick('logout')} icon={<FaSignOutAlt />} />
    </div>

  );
}