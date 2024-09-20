import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";

import { GlobalStateContext } from "../../context/GlobalStateContext";
import { AiFillClockCircle } from "react-icons/ai";
import PropTypes from "prop-types";
import { reducerCases } from "../../utils/Constants";


export default function Body({ headerBackground }) {  

  const [state, dispatch] = useContext(GlobalStateContext);

  const { selectedPlaylistId, selectedPlaylist } = state;


 
  if (!state) {
    console.error('State is undefined');
    return null;
    // or handle it appropriately
  }
  
  const { token } = state;  

  useEffect(() => {
    const getInitialPlaylist = async () => {
      try {
        const response = await instance.get(`/playlists/${selectedPlaylistId}`, {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        });
        const selectedPlaylist = {
          id: response.data.id,
          name: response.data.name,
          description: response.data.description.startsWith("<a") ? "" : response.data.description,
          image: response.data.images[0].url,
          tracks: response.data.tracks.items.map(({ track }) => ({
            id: track.id,
            name: track.name,
            artists: track.artists.map((artist) => artist.name),
            image: track.album.images[2].url,
            duration: track.duration_ms,
            album: track.album.name,
            context_uri: track.album.uri,
            track_number: track.track_number,
          })),
        };
        dispatch({ type: reducerCases.SET_PLAYLIST, selectedPlaylist });
      } catch (error) {
        console.error("Error fetching playlist:", error);
      }
    };
    if (selectedPlaylistId && token) {
      getInitialPlaylist();
    }
  }, [token, dispatch, selectedPlaylistId]);

  const playTrack = async (id, name, artists, image, context_uri, track_number) => {
    try {
      const response = await axios.put(
        `https://api.spotify.com/v1/me/player/play`,
        {
          context_uri,
          offset: {
            position: track_number - 1,
          },
          position_ms: 0,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.status === 204) {
        const currentlyPlaying = { id, name, artists, image };
        dispatch({ type: "SET_PLAYING", currentlyPlaying });
        dispatch({ type: "SET_PLAYER_STATE", playerState: true });
      } else {
        dispatch({ type: "SET_PLAYER_STATE", playerState: true });
      }
    } catch (error) {
      console.error("Error playing track:", error);
    }
  };

  const msToMinutesAndSeconds = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

  return (
    <Container headerBackground={headerBackground}>
      {selectedPlaylist && (
        <>
          <div className="playlist">
            <div className="image">
              <img src={selectedPlaylist.image} alt="selected playlist" />
            </div>
            <div className="details">
              <span className="type">PLAYLIST</span>
              <h1 className="title">{selectedPlaylist.name}</h1>
              <p className="description">{selectedPlaylist.description}</p>
            </div>
          </div>
          <div className="list">
            <div className="header-row">
              <div className="col">
                <span>#</span>
              </div>
              <div className="col">
                <span>TITLE</span>
              </div>
              <div className="col">
                <span>ALBUM</span>
              </div>
              <div className="col">
                <span>
                  <AiFillClockCircle />
                </span>
              </div>
            </div>
            <div className="tracks">
              {selectedPlaylist.tracks.map(
                (
                  { id, name, artists, image, duration, album, context_uri, track_number },
                  index
                ) => (
                  <div
                    className="row"
                    key={id}
                    onClick={() =>
                      playTrack(id, name, artists, image, context_uri, track_number)
                    }
                  >
                    <div className="col">
                      <span>{index + 1}</span>
                    </div>
                    <div className="col detail">
                      <div className="image">
                        <img src={image} alt="track" />
                      </div>
                      <div className="info">
                        <span className="name">{name}</span>
                        <span>{artists.join(", ")}</span>
                      </div>
                    </div>
                    <div className="col">
                      <span>{album}</span>
                    </div>
                    <div className="col">
                      <span>{msToMinutesAndSeconds(duration)}</span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </>
      )}
    </Container>
  );
}

Body.propTypes = {
  headerBackground: PropTypes.bool,
};

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${({ headerBackground }) => (headerBackground ? "#121212" : "rgb(32, 70, 60)")};
  padding: 20px;

  .playlist {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 20px;

    .image {
      img {
        height: 15rem;
        box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
      }
    }

    .details {
      display: flex;
      flex-direction: column;
      color: #e0dede;

      .title {
        color: white;
        font-size: 2.5rem;
      }
    }
  }

  .list {
    .header-row {
      display: grid;
      grid-template-columns: 0.3fr 3fr 2fr 0.1fr;
      margin-bottom: 10px;
      color: #dddcdc;
      padding: 10px 20px;
      background-color: ${({ headerBackground }) => (headerBackground ? "#000000dc" : "none")};
    }

    .tracks {
      display: flex;
      flex-direction: column;

      .row {
        padding: 10px 20px;
        display: grid;
        grid-template-columns: 0.3fr 3.1fr 2fr 0.1fr;
        align-items: center;
        color: #dddcdc;
        cursor: pointer;

        &:hover {
          background-color: rgba(0, 0, 0, 0.7);
        }

        .col {
          display: flex;
          align-items: center;

          img {
            height: 40px;
            width: 40px;
            margin-right: 10px;
          }
        }

        .detail {
          display: flex;
          gap: 10px;

          .info {
            display: flex;
            flex-direction: column;
          }
        }
      }
    }
  }
`;