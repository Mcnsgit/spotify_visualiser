
// import React, { useEffect, useRef } from "react";
// import {Canvas, useFrame, useThree} from "@react-three/fiber";
// import * as THREE from "three";
// import ThreeJS from '../services/ThreeJS';
// import propTypes from 'prop-types';
// import AudioAnalyzer from '../services/AudioAnalyzer';
// let width = 310;
// let height = 267;

// const AudioVisualizer = ({ audioSource }) => {
//     const containerRef = useRef();
//     const threeJSRef = useRef();
//     const audioAnalyzerRef = useRef();

//     useEffect(() => {
//         const audioContext = new (window.AudioContext || window.AudioContext)();
//         audioAnalyzerRef.current = new AudioAnalyzer(audioContext, audioSource);
//         threeJSRef.current = new ThreeJS(containerRef.current);
//     }, [audioSource]);


		

// 	useFrame(() => {
// 		const frequencyData = audioAnalyzerRef.current.getFrequencyData();
		
// 		const container = document.querySelector("#canvasWrapper");
// 		const oldCanvas = document.querySelector("#canvasWrapper canvas");
// 		if (oldCanvas) oldCanvas.remove();

// 		let canvas = document.createElement("canvas");
// 		canvas.width = width;
// 		canvas.height = height;
// 		container?.appendChild(canvas);

// 		let ctx = canvas?.getContext("2d");

// 		analyser.fftSize = 256;

// 		let bufferLength = analyser.frequencyBinCount;

// 		let dataArray = new Uint8Array(bufferLength);

// 		let barWidth = (width / bufferLength) * 2.5;
// 		let barHeight;
// 		let x;

// 		function renderFrame() {
// 			requestAnimationFrame(renderFrame);
// 			x = 0;

// 			analyser.getByteFrequencyData(dataArray);

// 			ctx.fillStyle = "#030816";
// 			ctx.fillRect(0, 0, width, height);

// 			for (let i = 0; i < bufferLength; i++) {
// 				barHeight = dataArray[i];

// 				let t = i / bufferLength;
// 				let r = (1 - t) * 255 + t * 2;
// 				let g = (1 - t) * 238 + t * 215;
// 				let b = (1 - t) * 8 + t * 242;

// 				ctx.fillStyle =
// 					"rgb(" +
// 					Math.floor(r) +
// 					"," +
// 					Math.floor(g) +
// 					"," +
// 					Math.floor(b) +
// 					")";

// 				ctx.fillRect(x, height - barHeight, barWidth, barHeight);

// 				x += barWidth + 1;
// 			}
// 		}

// 		renderFrame();
// 	}, [currentSongIndex, analyser, audioSource]);

// 	return <div id="canvasWrapper" />;
// };

// Visualizer.propTypes = {
// 	source
// }
// export default Visualizer;
