import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * @component Sketch - a simple 2d <canvas> animation interface.
 */
export default function Sketch({ main = null, container = document.body, hidpi = true } = {}) {
  const [queue, setQueue] = useState([]);
  const [active, setActive] = useState(false);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const hidpiRef = useRef(hidpi);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvasRef.current = canvas;
    ctxRef.current = ctx;
    container.appendChild(canvas);
    setSize();

    window.addEventListener('resize', setSize);

    return () => {
      window.removeEventListener('resize', setSize);
      container.removeChild(canvas);
    };
  }, [container]);

  useEffect(() => {
    if (main !== null) {
      add('main', main);
    }
  }, [main]);

  const setSize = useCallback(() => {
    const dpi = hidpiRef.current ? window.devicePixelRatio : 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    canvas.width = width * dpi;
    canvas.height = height * dpi;
    canvas.style.transformOrigin = 'top left';
    canvas.style.transform = `scale(${1 / dpi})`;
    ctx.scale(dpi, dpi);
  }, []);

  const add = useCallback((name, method, duration = null) => {
    setQueue((prevQueue) => [
      ...prevQueue,
      { name, method, duration, start: window.performance.now() }
    ]);
  }, []);

  const remove = useCallback((name) => {
    setQueue((prevQueue) => prevQueue.filter(item => item.name !== name));
  }, []);

  const start = useCallback(() => {
    if (active) return;
    setActive(true);
    requestAnimationFrame(loop);
  }, [active]);

  const stop = useCallback(() => {
    if (!active) return;
    setActive(false);
    cancelAnimationFrame(loop);
  }, [active]);

  const paint = useCallback((now, { name, start, duration, method }) => {
    const elapsed = now - start;
    const progress = typeof duration === 'number' ? Math.min(elapsed / duration, 1) : null;
    const state = {
      ctx: ctxRef.current,
      width: canvasRef.current.width,
      height: canvasRef.current.height,
      now,
      progress,
      duration,
      elapsed,
      start
    };

    method(state);

    if (progress === 1) {
      remove(name);
    }
  }, [remove]);

  const loop = useCallback((now) => {
    if (active) {
      requestAnimationFrame(loop);
    }

    queue.forEach(item => paint(now, item));
  }, [active, queue, paint]);

  return (
    <div>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <canvas ref={canvasRef} />
    </div>
  );
}
