import { useState, useEffect, useRef, useCallback } from 'react';
import Observe from '../../../utils/observe';
import * as cookies from '../../../utils/cookie';
import { get } from '../../../utils/network';
import interpolate from '../../../utils/interpolate';
import { scaleLog } from 'd3-scale';
import { min } from 'd3-array';
import ease from '../../../utils/easing';
import axios from 'axios';
import AuthService from '../../../services/AuthService';
import apiClient from '../../../api/ApiClient';

/**
 * @component Sync
 * 
 * Creates an interface for analyzing a playing Spotify track in real-time.
 * Exposes event hooks for reacting to changes in intervals. 
 */
export default function Sync({ 
  volumeSmoothing = 100,
  pingDelay = 2500
}) { 
  const accessToken = localStorage.getItem("token");

  const [state, setState] = useState({
    api: {
      currentlyPlaying: 'https://api.spotify.com/v1/me/player',
      trackAnalysis: 'https://api.spotify.com/v1/audio-analysis/',
      trackFeatures: 'https://api.spotify.com/v1/audio-features/',
      tokens: {
        accessToken,
      },
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Accept': 'application/json'
      },
      pingDelay
    },
    intervalTypes: ['tatums', 'segments', 'beats', 'bars', 'sections'],
    activeIntervals: Observe({
      tatums: {},
      segments: {},
      beats: {},
      bars: {},
      sections: {}
    }),
    currentlyPlaying: {},
    trackAnalysis: {},
    trackFeatures: {},
    initialTrackProgress: 0,
    initialStart: 0,
    trackProgress: 0,
    active: false,
    initialized: false,
    volumeSmoothing,
    volume: 0,
    queues: {
      volume: [],
      beat: []
    }
  });

  const hooks = useRef({
    tatum: () => {},
    segment: () => {},
    beat: () => {},
    bar: () => {},
    section: () => {}
  });

  const tickRef = useRef(null);
    // Define getNewToken first since other functions depend on it
  const getNewToken = useCallback(async () => {
    try {
      const { data } = await apiClient.get("/refresh", {
        params: { refresh_token: state.api.tokens.refreshToken }
      });
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      setState(prevState => ({
        ...prevState,
        api: {
          ...prevState.api,
          tokens: {
            ...prevState.api.tokens,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          },
          headers: {
            'Authorization': 'Bearer ' + data.access_token,
            'Accept': 'application/json'
          }
        }
      }));
      ping();
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  }, [state.api.tokens.refreshToken]);
  // Define ping which depends on getCurrentlyPlaying
  const ping = useCallback(() => {
    setTimeout(() => getCurrentlyPlaying(), state.api.pingDelay);
  }, [state.api.pingDelay]);
  // Define getCurrentlyPlaying which depends on getNewToken and ping
  const getCurrentlyPlaying = useCallback(async () => {
    try {
      const { data } = await get(state.api.currentlyPlaying, { headers: state.api.headers });
      if (!data || !data.is_playing) {
        if (state.active) {
          setState(prevState => ({ ...prevState, active: false }));
        }
        return ping();
      }

      processResponse(data);
   } catch (error) {
     if (error.response && error.response.status === 401) {
       getNewToken();
     } else {
       console.error('Error fetching currently playing track:', error);
     }
   }
 }, [state.api.currentlyPlaying, state.api.headers, state.active, ping, getNewToken]);

    
   
      
      
      // Initialize hooks and start pinging the API
      useEffect(() => {
        initHooks();
        ping();
        return () => cancelAnimationFrame(tickRef.current); // Cleanup on component unmount
      }, []);
      
      const initHooks = useCallback(() => {
        const { activeIntervals } = state;
        hooks.current.tatum = activeIntervals.watch('tatums', t => hooks.current.tatum(t));
        hooks.current.segment = activeIntervals.watch('segments', s => hooks.current.segment(s));
        hooks.current.beat = activeIntervals.watch('beats', b => hooks.current.beat(b));
        hooks.current.bar = activeIntervals.watch('bars', b => hooks.current.bar(b));
        hooks.current.section = activeIntervals.watch('sections', s => hooks.current.section(s));
      }, [state.activeIntervals]);
      

  const processResponse = useCallback((data) => {
    const songsInSync = (JSON.stringify(data.item) === JSON.stringify(state.currentlyPlaying));

    if (!state.initialized || !songsInSync || !state.active) {
      return getTrackInfo(data);
    }

    ping();
  }, [state.currentlyPlaying, state.initialized, state.active, ping]);

  const getTrackInfo = useCallback(async (data) => {
    try {
      const tick = window.performance.now();
      const [analysis, features] = await Promise.all([
        get(state.api.trackAnalysis + data.item.id, { headers: state.api.headers }),
        get(state.api.trackFeatures + data.item.id, { headers: state.api.headers })
      ]);

      state.intervalTypes.forEach((t) => {
        const type = analysis.data[t];
        type[0].duration = type[0].start + type[0].duration;
        type[0].start = 0;
        type[type.length - 1].duration = (data.item.duration_ms / 1000) - type[type.length - 1].start;
        type.forEach((interval) => {
          if (interval.loudness_max_time) interval.loudness_max_time *= 1000;
          interval.start *= 1000;
          interval.duration *= 1000;
        });
      });

      const tock = window.performance.now() - tick;

      setState(prevState => ({
        ...prevState,
        currentlyPlaying: data.item,
        trackAnalysis: analysis.data,
        trackFeatures: features.data,
        initialTrackProgress: data.progress_ms + tock,
        trackProgress: data.progress_ms + tock,
        initialStart: window.performance.now(),
        initialized: prevState.initialized || true,
        active: prevState.active || true
      }));

      if (!state.initialized) {
        requestAnimationFrame(tickRef.current);
      }

      ping();
    } catch (error) {
      console.error('Error fetching track info:', error);
    }
  }, [state.api.trackAnalysis, state.api.trackFeatures, state.api.headers, state.intervalTypes, ping]);

  const setActiveIntervals = useCallback(() => {
    const determineInterval = (type) => {
      const analysis = state.trackAnalysis[type];
      const progress = state.trackProgress;
      for (let i = 0; i < analysis.length; i++) {
        if (i === (analysis.length - 1)) return i;
        if (analysis[i].start < progress && progress < analysis[i + 1].start) return i;
      }
    };

    state.intervalTypes.forEach(type => {
      const index = determineInterval(type);
      if (!state.activeIntervals[type].start || index !== state.activeIntervals[type].index) {
        state.activeIntervals[type] = { ...state.trackAnalysis[type][index], index };
      }

      const { start, duration } = state.activeIntervals[type];
      const elapsed = state.trackProgress - start;
      state.activeIntervals[type].elapsed = elapsed;
      state.activeIntervals[type].progress = ease(elapsed / duration);
    });
  }, [state.trackAnalysis, state.trackProgress, state.intervalTypes, state.activeIntervals]);

  const getVolume = useCallback(() => {
    const {
      loudness_max,
      loudness_start,
      loudness_max_time,
      duration,
      elapsed,
      start,
      index
    } = state.activeIntervals.segments;

    if (!state.trackAnalysis.segments[index + 1]) return 0;

    const next = state.trackAnalysis.segments[index + 1].loudness_start;
    const current = start + elapsed;

    if (elapsed < loudness_max_time) {
      const progress = Math.min(1, elapsed / loudness_max_time);
      return interpolate(loudness_start, loudness_max)(progress);
    } else {
      const _start = start + loudness_max_time;
      const _elapsed = current - _start;
      const _duration = duration - loudness_max_time;
      const progress = Math.min(1, _elapsed / _duration);
      return interpolate(loudness_max, next)(progress);
    }
  }, [state.activeIntervals.segments, state.trackAnalysis.segments]);

  const tick = useCallback((now) => {
    requestAnimationFrame(tick);

    if (!state.active) return;

    setState(prevState => ({
      ...prevState,
      trackProgress: (now - prevState.initialStart) + prevState.initialTrackProgress
    }));

    setActiveIntervals();

    const volume = getVolume();
    const queues = state.queues;

    queues.volume.unshift(volume);

    if (queues.volume.length > 400) {
      queues.volume.pop();
    }

    queues.beat.unshift(volume);

    if (queues.beat.length > state.volumeSmoothing) {
      queues.beat.pop();
    }

    function average(arr) {
      return arr.reduce((a, b) => (a + b)) / arr.length;
    }

    const sizeScale = scaleLog()
      .domain([min(queues.volume), average(queues.volume)])
      .range([0, 1]);

    const beat = average(queues.beat);
    state.volume = sizeScale(beat);
  }, [state.active, state.initialStart, state.initialTrackProgress, setActiveIntervals, getVolume, state.queues, state.volumeSmoothing]);

  tickRef.current = tick;

  const watch = useCallback((key, method) => {
    state.watch(key, method);
  }, [state]);

  const on = useCallback((interval, method) => {
    hooks.current[interval] = method;
  }, []);

  const isActive = state.active === true;

  const getInterval = useCallback((type) => {
    return state.activeIntervals[type + 's'];
  }, [state.activeIntervals]);

  return (
    <div>
      {isActive && <div>Sync is active</div>}
      {/* Additional UI elements can be added here */}
    </div>
  );
}

export async function auth() {
  try {
    const { data } = await axios.get(AuthService.getAuthUrl());
    console.log(data);
    window.localStorage.setItem('auth_id', data.auth_id);
    window.localStorage.setItem('code', data.code);
    window.localStorage.setItem('redirect_uri', data.redirect_uri);
    window.localStorage.setItem('state', data.state);
    window.localStorage.setItem('scope', data.scope);

    window.location.href = data.url;
  } catch (error) {
    console.error('Error authenticating:', error);
    window.location.href = 'http://localhost:3000/login';
  }
  return true;
}

export async function authCallback() {
  try {
    const { data } = await axios.get(AuthService.getAuthCallbackUrl());
    console.log(data);
    window.localStorage.setItem('auth_id', data.auth_id);
    window.localStorage.setItem('code', data.code);
    window.localStorage.setItem('redirect_uri', data.redirect_uri);
    window.localStorage.setItem('state', data.state);
    window.localStorage.setItem('scope', data.scope); 

    window.location.href = data.url;
  } catch (error) {
    console.error('Error authenticating:', error);
    window.location.href = 'http://localhost:3000/login';
  }
  return true;
}