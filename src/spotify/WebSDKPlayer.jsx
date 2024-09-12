import React, { useEffect, useState } from 'react';

const track = {
  name: "",
  album: {
      images: [
          { url: "" }
      ]
  },
  artists: [
      { name: "" }
  ]
}

const WebPlayback = ({ token }) => {
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [player, setPlayer] = useState(undefined);
  const [current_track, setTrack] = useState(track);
  // const [isReady, setReady] = useState(false); // Track player readiness
  // const [deviceId, setDeviceId] = useState(null);
  //   name: '',
  //   album: { images: [{ url: '' }] },
  //   artists: [{ name: '' }],
  // });

  useEffect(() => {
    if (!token) return;
  
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);
  
    script.onload = () => {
      window.onSpotifyWebPlaybackSDKReady = () => {
        const spotifyPlayer = new window.Spotify.Player({
          name: 'Spotify Web Player',
          getOAuthToken: cb => { cb(token); },
          volume: 0.5,
        });
  
        spotifyPlayer.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          setPlayer(spotifyPlayer);
        });
  
        spotifyPlayer.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
        });
        spotifyPlayer.addListener('player_state_changed', state => {
          if (!state) return;
          setCurrentTrack(state.track_window.current_track);
          setIsPlaying(!state.paused);
        });
  
        spotifyPlayer.connect();
      };
    };
  
    return () => {
      script.remove();
    };
  }, [token]);

        player.addListener('player_state_changed', ( state => {

            if (!state) {
                return;
            }

            setTrack(state.track_window.current_track);
            setPaused(state.paused);

            player.getCurrentState().then( state => { 
                (!state)? setActive(false) : setActive(true) 
            });

        }));

        player.connect();

    
if (!is_active) { 
  return (
      <>
          <div className="container">
              <div className="main-wrapper">
                  <b> Instance not active. Transfer your playback using your Spotify app </b>
              </div>
          </div>
      </>)
} else {
  return (
      <>
          <div className="container">
              <div className="main-wrapper">

                  <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />

                  <div className="now-playing__side">
                      <div className="now-playing__name">{current_track.name}</div>
                      <div className="now-playing__artist">{current_track.artists[0].name}</div>

                      <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
                          &lt;&lt;
                      </button>

                      <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
                          { is_paused ? "PLAY" : "PAUSE" }
                      </button>

                      <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
                          &gt;&gt;
                      </button>
                  </div>
              </div>
          </div>
      </>
  );
}
}

export default WebPlayback