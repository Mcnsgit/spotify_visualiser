import React, { useRef, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import * as THREE from 'three';
import { getAudioAnalysis, getCurrentPlayback } from '../../../utils/api';

function Visualizer() {
  const mountRef = useRef(null);
  const [audioData, setAudioData] = useState(null);

  useEffect(() => {
    const fetchAudioData = async () => {
      try {
        const playback = await getCurrentPlayback();
        if (playback && playback.item) {
          const analysis = await getAudioAnalysis(playback.item.id);
          setAudioData(analysis);
        }
      } catch (error) {
        console.error('Error fetching audio data:', error);
      }
    };

    fetchAudioData();
    const intervalId = setInterval(fetchAudioData, 10000); // Fetch every 10 seconds

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);

      if (audioData) {
        // Use audioData to modify the cube
        const sections = audioData.sections[0];
        cube.scale.x = sections.loudness;
        cube.scale.y = sections.tempo / 100;
        cube.scale.z = sections.duration;
      }

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [audioData]);

  return (
    <Box
      ref={mountRef}
      width="100%"
      height="400px"
      bg="gray.700"
      borderRadius="md"
    />
  );
}

export default Visualizer;