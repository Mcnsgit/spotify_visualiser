// import React, { Suspense, useEffect, useRef, useMemo } from 'react';
// import * as THREE from 'three';
// import { Canvas, useFrame } from '@react-three/fiber';
// import useStore from './audioLink';
// import { useSelector } from 'react-redux';
// import propTypes from 'prop-types';
// import './styles.css';

// export default function Visualizer({ trackId, accessToken }) {
// 	const currentTrack = useSelector((state) => state.player.currentTrack);
// 	const isPlaying = useSelector((state) => state.player.isPlaying);
// 	const loadAudio = useStore((state) => state.api.loadAudio);
// 	const loaded = useStore((state) => state.api.loaded);

// 	useEffect(() => {
// 		loaded(trackId, accessToken, {
// 			threshold: 10,
// 			expire: 500,
// 		});
// 	}, [trackId, accessToken, loadAudio]);

// 	return (
// 		<>
// 			<Canvas shadows dpr={[1, 2]} camera={{ position: [-1, 1.5, 2], fov: 25 }}>
// 				<spotLight
// 					position={[-4, 4, -4]}
// 					angle={0.06}
// 					penumbra={1}
// 					castShadow
// 					shadow-mapSize-width={2048}
// 					shadow-mapSize-height={2048}
// 				/>
// 				<Suspense fallback={null}>
// 					<Track />
// 					{isPlaying && (
// 						<div className="track-info">
// 							Visualizing {currentTrack?.title}
// 						</div>
// 					)}
// 					<Zoom />
// 				</Suspense>
// 				<mesh
// 					receiveShadow
// 					rotation={[-Math.PI / 2, 0, 0]}
// 					position={[0, -0.025, 0]}
// 				>
// 					<planeGeometry args={[5, 5]} />
// 					<shadowMaterial transparent opacity={0.15} />
// 				</mesh>
// 			</Canvas>
// 		</>
// 	);
// }

// Visualizer.propTypes = {
// 	trackId: propTypes.string.isRequired,
// 	accessToken: propTypes.string.isRequired,
// };

// function Track({ y = 2500, space = 1.8, width = 0.01, height = 0.05, ...props }) {
// 	const ref = useRef();
// 	const audio = useStore((state) => state.audio);

// 	const instancedMesh = useMemo(() => {
// 		const obj = new THREE.Object3D();
// 		obj.updateMatrix();
// 		return (
// 			<instancedMesh
// 				castShadow
// 				ref={ref}
// 				args={[null, null, audio.track.data.length]}
// 				{...props}
// 			>
// 				<planeGeometry args={[width, height]} />
// 				<meshBasicMaterial toneMapped={false} />
// 			</instancedMesh>
// 		);
// 	}, [audio.track.data.length, width, height, props]);

// 	useFrame(() => {
// 		const avg = audio.track.avg;
// 		const data = audio.track.data;

// 		for (let i = 0; i < data.length; i++) {
// 			const obj = new THREE.Object3D();
// 			obj.position.set(
// 				i * width * space - (data.length * width * space) / 2,
// 				data[i] / y,
// 				0
// 			);
// 			obj.updateMatrix();
// 			ref.current.setMatrixAt(i, obj.matrix);
// 		}

// 		ref.current.material.color.setHSL(avg / 500, 0.75, 0.75);
// 		ref.current.instanceMatrix.needsUpdate = true;
// 	});

// 	return instancedMesh;
// }

// function Zoom() {
// 	const audio = useStore((state) => state.audio);

// 	useFrame((state) => {
// 		state.camera.fov = 25 - audio.track.avg / 15;
// 		state.camera.updateProjectionMatrix();
// 	});

// 	return null;
// }
