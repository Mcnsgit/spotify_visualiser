import React, { useEffect } from "react";
import { useGlobalState } from "../context/GlobalStateContext.jsx"; 
import { reducerCases } from "../context/globalStateUtils.jsx";
import axios from "../utils/axios.jsx";
import PropTypes from "prop-types";

export default function withPlayerHoc(ComposedComponent) {
  const PlayerHoc = (props) => {
      const { state, dispatch } = useGlobalState();
      const currentTrack  = state?.currentTrack || {};
      
      useEffect(() => {
        if (currentTrack?.id) {
          containsCurrentTrack(currentTrack.id);
        }
      }, [currentTrack]);

      const containsCurrentTrack = async (id) => {
        try {
          const response = await axios.get(`/me/tracks/contains?ids=${id}`);
          dispatch({
            type: reducerCases.SET_CONTAINS_TRACK,
            payload: response.data.includes(true),
          });
        } catch (error) {
          console.error("Error checking track:", error);
        }
      };
  
      return <ComposedComponent {...props} currentTrack={currentTrack} />;
    };
  
    PlayerHoc.propTypes = {
      currentTrack: PropTypes.object,
      playTrack: PropTypes.func.isRequired,
    };
  
    return PlayerHoc;
  }