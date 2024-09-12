
import { useState, useEffect, useCallback } from 'react';
import Visualizer from './classes/visualizer';
import { interpolateRgb, interpolateBasis } from 'd3-interpolate';
import { getRandomElement } from './util/array';

export default function HelloWorld() {
  const visualizer = new Visualizer({ volumeSmoothing: 100 });

  useEffect(() => {
    visualizer.sync.on('tatum', tatum => { /* add logic here */ });
    visualizer.sync.on('segment', segment => { /* add logic here */ });
    visualizer.sync.on('beat', beat => { /* add logic here */ });
    visualizer.sync.on('bar', bar => { /* add logic here */ });
    visualizer.sync.on('section', section => { /* add logic here */ });
  }, [visualizer]);

  const paint = useCallback(({ ctx, height, width, now }) => {
    const volume = visualizer.sync.volume;
    const beat = visualizer.sync.getInterval('beat');
    console.log(volume, beat.index);
  }, [visualizer]);

  useEffect(() => {
    visualizer.paint = paint;
  }, [paint, visualizer]);

  return <div id="hello-world-container" />;
}
