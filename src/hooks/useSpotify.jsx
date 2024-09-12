import {useEffect, useState} from  'react';
import { getCookie } from '../helpers/common';
import {auth ,getInfo} from '../api/api';
import { useInterval } from './useInterval';

const PROGRESS_UPDATE_DELAY = 100;
const SERVER_CALL_DELAY = 5000;
export default function useSpotify() {
    const [token, setToken] = useState(getCookie('ACCESS_TOKEN'));
    const [lastUpdate, setLastUpdate] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [track, setTrack] = useState(null);

    useEffect(() => {
        if (!token) {
            auth(); // Trigger authentication if no token is found
        }
    }, [token]);

    useInterval(() => {
        const now = window.performance.now();

        getInfo(token)
        .then(player => {
          if (player.is_playing !== isPlaying)
            setIsPlaying(player.is_playing);
  
          if (!player.error){
            const new_now = window.performance.now();
            const server_progress = player.progress_ms + new_now - now; // Approximation on the time from the server
  
            if (Math.abs(server_progress - progress) > 300 || isNaN(progress)){
              setProgress(server_progress);
              setLastUpdate(new_now);
            }
  
            if (player.is_playing && track?.name !== player.item.name){
              setTrack(player.item);
  
            
            }
          }
        });
    }, SERVER_CALL_DELAY);

    useInterval(() => {
        const new_now = window.performance.now();
        setLastUpdate(new_now);
        if (isPlaying) {
          setProgress(progress + new_now - lastUpdate <= track?.duration_ms ? progress + new_now - lastUpdate : track?.duration_ms);
        }
      }, PROGRESS_UPDATE_DELAY);
    
      return null;
    }