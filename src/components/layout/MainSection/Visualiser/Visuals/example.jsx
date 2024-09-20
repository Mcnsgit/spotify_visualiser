import { useState, useEffect, useCallback } from 'react';
import Visualizer from './Visualiser';
import { interpolateRgb, interpolateBasis } from 'd3-interpolate';
import { getRandomElement } from '../../../../utils/array';

export default function Example() {
  const [theme] = useState(['#18FF2A', '#7718FF', '#06C5FE', '#FF4242', '#18FF2A']);
  const [lastColor, setLastColor] = useState(null);
  const [nextColor, setNextColor] = useState(null);
  const visualizer = new Visualizer({ volumeSmoothing: 80 });

  useEffect(() => {
    visualizer.sync.on('beat', beat => {
      setLastColor(nextColor || getRandomElement(theme));
      setNextColor(getRandomElement(theme.filter(color => color !== nextColor)));
    });
  }, [visualizer, theme, nextColor]);

  const paint = useCallback(({ ctx, height, width, now }) => {
    const volume = visualizer.sync.volume;
    const beat = visualizer.sync.getInterval('beat');
    const bar = visualizer.sync.getInterval('bar');
    const bump = interpolateBasis([0, 150, 0])(beat.progress);

    ctx.fillStyle = interpolateRgb(lastColor, nextColor)(beat.progress);
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, (volume * height / 3) + bump, 0, Math.PI * 2);
    ctx.fill();
  }, [visualizer, lastColor, nextColor]);

  useEffect(() => {
    visualizer.paint = paint;
  }, [paint, visualizer]);

  return <div id="example-container" />;
}
