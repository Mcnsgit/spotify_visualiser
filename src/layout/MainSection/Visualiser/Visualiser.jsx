// Visualizer.jsx
import React, { useRef, useEffect, useState} from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader.js';
import { ColorCorrectionShader } from 'three/examples/jsm/shaders/ColorCorrectionShader.js';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';
import apiClient from '../../../api/ApiClient';

const Visualizer = ({currentTrack, accessToken, isPlaying, onPlayPauseClick}) => {
    const mountRef = useRef(null);
    const audioRef = useRef(new Audio());
    const analyseRef = useRef(null);
    const dataArrayRef = useRef(null);
    const [audioContext, setAudioContext] = useState(null);
    useEffect(() => {
        if (!audioContext) {
            const context = new (window.AudioContext || window.AudioContext)();
            setAudioContext(context);

            const analyser = context.createAnalyser();
            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            analyser.current = analyser;
            dataArrayRef.current = dataArray;

            // Connect the audio element to the analyser
            const source = context.createMediaElementSource(audioRef.current);
            source.connect(analyser);
            analyser.connect(context.destination);
        }

        return () => {
            if (audioContext) {
                audioContext.close();
            }
        };
    }, [audioContext]);

    useEffect(() => {
        if (currentTrack?.preview_url) {
            audioRef.current.src = currentTrack.preview_url;
            if (isPlaying) {
                audioRef.current.play();
            }
        }
    }, [currentTrack, isPlaying]);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        // === THREE.JS Setup ===
        const scene = new THREE.Scene();

        // Camera
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 10;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000);
        mountRef.current.appendChild(renderer.domElement);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambientLight);

        const light1 = new THREE.PointLight(0xffffff, 10);
        light1.position.set(5, 5, 5);
        scene.add(light1);

        const light2 = new THREE.PointLight(0xffffff, 10);
        light2.position.set(-5, -5, 5);
        scene.add(light2);

        // Post-processing
        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        const filmPass = new FilmPass(0.35, 0.025, 648, false);
        composer.addPass(filmPass);

        const vignettePass = new ShaderPass(VignetteShader);
        vignettePass.uniforms["offset"].value = 1.5;
        vignettePass.uniforms["darkness"].value = 1.2;
        composer.addPass(vignettePass);

        const colorCorrectionPass = new ShaderPass(ColorCorrectionShader);
        composer.addPass(colorCorrectionPass);

        const copyPass = new ShaderPass(CopyShader);
        copyPass.renderToScreen = true;
        composer.addPass(copyPass);

        // Geometries
        const geometries = [];
        const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
        for (let i = 0; i < 10; i++) {
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            );
            geometries.push(mesh);
            scene.add(mesh);
        }

        // Particles
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 1000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 100;
            positions[i + 1] = (Math.random() - 0.5) * 100;
            positions[i + 2] = (Math.random() - 0.5) * 100;

            colors[i] = Math.random();
            colors[i + 1] = Math.random();
            colors[i + 2] = Math.random();
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 1,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false,
            sizeAttenuation: true,
        });

        const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particleSystem);

        // Animation Loop
        let frameId;
        const animate = () => {
            frameId = requestAnimationFrame(animate);

            // Rotate geometries
            geometries.forEach((geom) => {
                geom.rotation.x += 0.01;
                geom.rotation.y += 0.01;
            });

            // Update particles
            const time = performance.now() * 0.001;
            const positions = particleGeometry.attributes.position.array;
            for (let i = 0; i < particleCount * 3; i += 3) {
                const x = positions[i];
                const y = positions[i + 1];
                const z = positions[i + 2];

                // Example movement: Circular motion
                const angle = time * 0.5;
                const radius = 0.1;
                positions[i] = x + Math.sin(angle) * radius;
                positions[i + 1] = y + Math.cos(angle) * radius;
                positions[i + 2] = z + Math.sin(angle) * radius;
            }
            particleGeometry.attributes.position.needsUpdate = true;

            // Audio Visualization
            if (analyseRef.current && dataArrayRef.current) {
                analyseRef.current.getByteFrequencyData(dataArrayRef.current);
                const audioData = dataArrayRef.current;

                // Adjust geometries based on audio frequency data
                geometries.forEach((geom, index) => {
                    const scale = audioData[index % audioData.length] / 255;
                    geom.scale.set(1 + scale, 1 + scale, 1 + scale);
                });

                // Adjust particles based on audio frequency data
                particleMaterial.size = audioData[0] / 255 * 2;
            }

            controls.update();
            composer.render();
        };

        animate();

        // Handle window resize
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            composer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        // Clean up on unmount
        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', handleResize);
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
            // Dispose geometries, materials, and other resources
            geometries.forEach((mesh) => {
                mesh.geometry.dispose();
                mesh.material.dispose();
                scene.remove(mesh);
            });
            particleGeometry.dispose();
            particleMaterial.dispose();
            scene.remove(particleSystem);
            scene.remove(ambientLight);
            scene.remove(light1);
            scene.remove(light2);
            controls.dispose();
            composer.dispose();
            renderer.dispose();
        };
    }, [currentTrack, isPlaying]);

    return (
        <div style={{ position: 'relative' }}>
            <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />
            <button
                onClick={onPlayPauseClick}
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    padding: '10px 20px',
                    zIndex: 1,
                }}
            >
                {isPlaying ? 'Pause' : 'Play'}
            </button>
        </div>
    );
};

export default Visualizer;