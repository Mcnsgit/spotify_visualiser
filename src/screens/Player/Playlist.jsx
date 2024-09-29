import React, { useEffect, useContext, useState } from "react";
import styled from "styled-components";
import { AuthContext } from "../../AuthContext";
import SpotifyWebApi from "spotify-web-api-js";


const spotifyApi = new SpotifyWebApi();


export default function Playlists() {
  const { accessToken } = useContext(AuthContext);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (!accessToken) return;
    
    spotifyApi.setAccessToken(accessToken);

    spotifyApi.getUserPlaylists()
      .then(data => {
        setPlaylists(data.items);
        console.log("User playlists:", data.items);
      })
      .catch(error => console.error('Error fetching playlists:', error));
  }, [accessToken]);

  const changeCurrentPlaylist = (id) => {
    // Implement this function based on your application logic
    console.log("Selected playlist ID:", id);
  };

  return (
    <Container>
      <ul>
        {playlists.map(({ name, id }) => {
          return (
            <li key={id} onClick={() => changeCurrentPlaylist(id)}>
              {name}
            </li>
          );
        })}
      </ul>
    </Container>
  );
}

const Container = styled.div`
  color: #b3b3b3;
  height: 100%;
  overflow: hidden;
  ul {
    list-style-type: none;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    height: 55vh;
    max-height: 100%;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.7rem;
      &-thumb {
        background-color: rgba(255, 255, 255, 0.6);
      }
    }
    li {
      transition: 0.3s ease-in-out;
      cursor: pointer;
      &:hover {
        color: white;
      }
    }
  }
`;