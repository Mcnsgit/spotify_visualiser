    N// Visualizer.jsx
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const STATES = ['ENDED', 'PLAYING', 'PAUSED', 'BUFFERING'];

const OPTIONS_ANALYSER = {
  smoothingTime: 0.6,
  fftSize: 512,
};

const OPTIONS_DEFAULT = {
  autoplay: false,
  shadowBlur: 20,
  shadowColor: '#ffffff',
  barColor: '#cafdff',
  barWidth: 2,
  barHeight: 2,
  barSpacing: 7,
  font: ['12px', 'Helvetica'],
};

const Visualizer = ({
  model,
  options: propsOptions = {},
  extensions: propsExtensions = {},
  onChange,
  className = '',
  width = '500',
  height = '500',
}) => {
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState((new Date(0, 0)).getTime());
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');
  const [options, setOptions] = useState({ ...OPTIONS_DEFAULT, ...propsOptions });
  const [extensions, setExtensions] = useState({
    renderStyle: _onRenderStyleDefault,
    renderText: _onRenderTextDefault,
    renderTime: _onRenderTimeDefault,
    ...propsExtensions,
  });

  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const frequencyDataRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const canvasCtxRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const intervalRef = useRef(null);

  // Initialize Audio Context and Analyser
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        _setContext();
        _setAnalyser();
        _setFrequencyData();
        _setCanvasContext();
        _setCanvasStyles();
        _onResetTimer();
        _onRender({ renderText: extensions.renderText, renderTime: extensions.renderTime });
        options.autoplay && _onResolvePlayState();
      } catch (error) {
        _onDisplayError(error);
      }
    };

    initializeAudio();

    return () => {
      // Cleanup
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  // Handle model change
  useEffect(() => {
    if (playing) {
      _onAudioStop().then(() => {
        _setBufferSourceNode();
        options.autoplay && _onResolvePlayState();
      });
    } else {
      _setBufferSourceNode();
      options.autoplay && _onResolvePlayState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  const _setContext = () => {
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new window.AudioContext();
    } catch (e) {
      throw new Error('Web Audio API is not supported.');
    }
  };

  const _setAnalyser = () => {
    const analyser = audioCtxRef.current.createAnalyser();
    analyser.smoothingTimeConstant = OPTIONS_ANALYSER.smoothingTime;
    analyser.fftSize = OPTIONS_ANALYSER.fftSize;
    analyserRef.current = analyser;
  };

  const _setFrequencyData = () => {
    const frequencyData = new Uint8Array(analyserRef.current.frequencyBinCount);
    frequencyDataRef.current = frequencyData;
  };

  const _setCanvasContext = () => {
    const canvasCtx = canvasRef.current.getContext('2d');
    canvasCtxRef.current = canvasCtx;
  };

  const _setCanvasStyles = () => {
    const { barColor, shadowBlur, shadowColor, font } = options;
    const canvasCtx = canvasCtxRef.current;
    const gradient = canvasCtx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(1, barColor);

    canvasCtx.fillStyle = gradient;
    canvasCtx.shadowBlur = shadowBlur;
    canvasCtx.shadowColor = shadowColor;
    canvasCtx.font = font.join(' ');
    canvasCtx.textAlign = 'center';
  };

  const _onResolvePlayState = () => {
    if (!playing) {
      audioCtxRef.current.state === 'suspended' ? _onAudioPlay() : _onAudioLoad();
    } else {
      _onAudioPause();
    }
  };

  const _onAudioLoad = () => {
    const canvasCtx = canvasCtxRef.current;
    const canvas = canvasRef.current;

    canvasCtx.fillText('Loading...', canvas.width / 2 + 10, canvas.height / 2 - 25);
    _onChange(STATES[3]);

    _httpGet()
      .then((response) => {
        audioCtxRef.current.decodeAudioData(
          response,
          (buffer) => {
            _onAudioPlay(buffer);
          },
          (error) => {
            _onDisplayError(error);
          }
        );
      })
      .catch((error) => {
        _onDisplayError(error);
      });
  };

  const _httpGet = () => {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.open('GET', model.path, true);
      req.responseType = 'arraybuffer';

      req.onload = () => {
        resolve(req.response);
      };

      req.onerror = (error) => {
        reject(error);
      };

      req.send();
    });
  };

  const _onAudioPlay = (buffer) => {
    const sourceNode = audioCtxRef.current.createBufferSource();
    sourceNode.buffer = buffer;
    sourceNode.connect(analyserRef.current);
    sourceNode.connect(audioCtxRef.current.destination);
    sourceNode.onended = _onAudioStop;
    sourceNodeRef.current = sourceNode;

    setPlaying(true);
    _onChange(STATES[1]);

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
      _onRenderFrame();
    } else {
      sourceNode.start(0);
      _onResetTimer();
      _onStartTimer();
      _onRenderFrame();
    }
  };

  const _onAudioPause = () => {
    setPlaying(false);
    audioCtxRef.current.suspend().then(() => {
      _onChange(STATES[2]);
    });
  };

  const _onAudioStop = () => {
    return new Promise((resolve) => {
      cancelAnimationFrame(animFrameIdRef.current);
      clearInterval(intervalRef.current);
      sourceNodeRef.current.disconnect();
      canvasCtxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      _onChange(STATES[0]);
      setPlaying(false);
      animFrameIdRef.current = null;
      resolve();
    });
  };

  const _onResetTimer = () => {
    setDuration((new Date(0, 0)).getTime());
    setMinutes('00');
    setSeconds('00');
  };

  const _onStartTimer = () => {
    intervalRef.current = setInterval(() => {
      if (playing) {
        let now = new Date(duration);
        let min = now.getHours();
        let sec = now.getMinutes() + 1;

        setMinutes(min < 10 ? `0${min}` : `${min}`);
        setSeconds(sec < 10 ? `0${sec}` : `${sec}`);
        setDuration(now.setMinutes(sec));
      }
    }, 1000);
  };

  const _onRenderFrame = () => {
    if (playing) {
      animFrameIdRef.current = requestAnimationFrame(_onRenderFrame);
      analyserRef.current.getByteFrequencyData(frequencyDataRef.current);
      _onRender(extensions);
    }
  };

  const _onRender = (exts) => {
    const canvasCtx = canvasCtxRef.current;
    const canvas = canvasRef.current;

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    Object.keys(exts).forEach((key) => {
      exts[key] && exts[key]();
    });
  };

  const _onRenderTimeDefault = () => {
    const canvasCtx = canvasCtxRef.current;
    const canvas = canvasRef.current;
    let time = `${minutes}:${seconds}`;
    canvasCtx.fillText(time, canvas.width / 2 + 10, canvas.height / 2 + 40);
  };

  const _onRenderTextDefault = () => {
    const canvasCtx = canvasCtxRef.current;
    const canvas = canvasRef.current;
    const { font } = options;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const fontAdjustment = 6;
    const alignAdjustment = 8;

    canvasCtx.textBaseline = 'top';
    canvasCtx.fillText(`by ${model.author}`, cx + alignAdjustment, cy);
    canvasCtx.font = `${parseInt(font[0], 10) + fontAdjustment}px ${font[1]}`;
    canvasCtx.textBaseline = 'bottom';
    canvasCtx.fillText(model.title, cx + alignAdjustment, cy);
    canvasCtx.font = font.join(' ');
  };

  const _onRenderStyleDefault = () => {
    const canvasCtx = canvasCtxRef.current;
    const canvas = canvasRef.current;
    const { barWidth, barHeight, barSpacing } = options;

    const radiusReduction = 70;
    const amplitudeReduction = 6;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = Math.min(cx, cy) - radiusReduction;
    const maxBarNum = Math.floor((radius * 2 * Math.PI) / (barWidth + barSpacing));
    const slicedPercent = Math.floor((maxBarNum * 25) / 100);
    const barNum = maxBarNum - slicedPercent;
    const freqJump = Math.floor(frequencyDataRef.current.length / maxBarNum);

    for (let i = 0; i < barNum; i++) {
      const amplitude = frequencyDataRef.current[i * freqJump];
      const theta = (i * 2 * Math.PI) / maxBarNum;
      const delta = ((3 * 45 - barWidth) * Math.PI) / 180;
      const x = 0;
      const y = radius - (amplitude / 12 - barHeight);
      const w = barWidth;
      const h = amplitude / amplitudeReduction + barHeight;

      canvasCtx.save();
      canvasCtx.translate(cx + barSpacing, cy + barSpacing);
      canvasCtx.rotate(theta - delta);
      canvasCtx.fillRect(x, y, w, h);
      canvasCtx.restore();
    }
  };

  const _onChange = (state) => {
    onChange && onChange({ status: state });
  };

  const _onDisplayError = (error) => {
    console.error(error);
  };

  const classes = ['visualizer', className].join(' ');

  return (
    <div className={classes} onClick={_onResolvePlayState}>
      <audio className="visualizer__audio" src={model.path}></audio>

      <div className="visualizer__canvas-wrapper">
        <canvas
          ref={canvasRef}
          className="visualizer__canvas"
          width={width}
          height={height}
        ></canvas>
      </div>
    </div>
  );
};

Visualizer.propTypes = {
  model: PropTypes.shape({
    path: PropTypes.string.isRequired,
    author: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  options: PropTypes.object,
  className: PropTypes.string,
  extensions: PropTypes.object,
  onChange: PropTypes.func,
  width: PropTypes.string,
  height: PropTypes.string,
};

export default Visualizer;