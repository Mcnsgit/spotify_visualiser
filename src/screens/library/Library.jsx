import React, { useState, useEffect } from "react";
import apiClient from "../../api/ApiClient"; 
import { IconContext } from "react-icons";
import { AiFillPlayCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import './Library.scss';

export default function Library() {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    apiClient.get("me/playlists").then(function (response) {
      setPlaylists(response.data.items);
    })
    .catch(function (error) {
      console.log(error);
    });
  }, []);

  const navigate = useNavigate();

  const playPlaylist = (id) => {
    navigate("/player",
    { state: { id: id } }
    );
  };

    return (
    <div className="screen-container">
      <div className="library-body">
        {playlists?.map((playlist) => (
          <div className="playlist-card"
          key={playlist.id}
          onClick={() =>
          playPlaylist(playlist.id)}
          >
            <img src={playlist.images[0].url} alt={playlist.name} 
            className="playlist-image"
            />
            <p className="playlist-title">{playlist.name}</p>
            <p className="playlist-subtitle">{playlist.tracks.total} songs</p>
            <div className="playlist-fade">
            <IconContext.Provider
            value={{size:"50px", colo: "#C4D0E3"}}>
              <AiFillPlayCircle />
            </IconContext.Provider>

          </div>  
          </div>
        ))}
        </div>
        </div>
    ); 
}
