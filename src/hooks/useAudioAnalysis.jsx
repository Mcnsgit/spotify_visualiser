import { useState, useEffect, useRef } from 'react';

const useAudioAnalysis = (audioUrl, getAudioFeatures) => {
  const [audioFeatures, setAudioFeatures] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const analyserRef = useRef(null);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const initializeAudioContext = async () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      try {
        audioRef.current.src = audioUrl;
        await audioRef.current.play();
        setIsPlaying(true);

        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        analyserRef.current = audioContextRef.current.createAnalyser();
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);

        if (getAudioFeatures) {
          const features = await getAudioFeatures(audioUrl);
          setAudioFeatures(features);
        }
      } catch (error) {
        console.error('Error initializing audio:', error);
        setError(error.message);
      }
    };

    if (audioUrl) {
      initializeAudioContext();
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioUrl, getAudioFeatures]);

  const getAudioData = () => {
    if (!analyserRef.current) return new Uint8Array();
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteTimeDomainData(dataArray);
    return dataArray;
  };

  const stopAudio = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return {
    audioFeatures,
    isPlaying,
    getAudioData,
    stopAudio,
    analyser: analyserRef.current,
    error
  };
};

export default useAudioAnalysis;