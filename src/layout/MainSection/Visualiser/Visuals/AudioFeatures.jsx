import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAudioAnalysisAction, getAudioFeaturesAction, getMultipleAudioFeaturesAction } from '../../actions/audioApiActions';
import Visualizer from '../Visualiser';

const SpotifyData = ({ trackIds }) => {
  const dispatch = useDispatch();
  const audioAnalysis = useSelector(state => state.audioAnalysis);
  const audioFeatures = useSelector(state => state.audioFeatures);
  const multipleAudioFeatures = useSelector(state => state.multipleAudioFeatures);


  useEffect(() => {
    if (trackIds.length === 1) {
      dispatch(getAudioAnalysisAction(trackIds[0]));
      dispatch(getAudioFeaturesAction(trackIds[0]));
    } else {
      dispatch(getMultipleAudioFeaturesAction(trackIds.join(',')));
    }
  }, [dispatch, trackIds]);

  return (
    <div>
      <h1>Spotify Audio Data</h1>
      {trackIds.length === 1 ? (
        <>
          <h2>Audio Analysis</h2>
          <pre>{JSON.stringify(audioAnalysis, null, 2)}</pre>
          <h2>Audio Features</h2>
          <pre>{JSON.stringify(audioFeatures, null, 2)}</pre>
          {audioFeatures && <Visualizer audioFeatures={audioFeatures} />}
        </>
      ) : (
        <>
          <h2>Multiple Audio Features</h2>
          <pre>{JSON.stringify(multipleAudioFeatures, null, 2)}</pre>
          {multipleAudioFeatures && <Visualizer audioFeatures={multipleAudioFeatures} />}
        </>
      )}
    </div>
  );
};

export default SpotifyData;