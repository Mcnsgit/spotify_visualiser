// src/helpers/format.js

/**
 * Convert milliseconds to a human-readable duration format.
 * @param {number} ms - Duration in milliseconds.
 * @returns {string} - Duration in mm:ss format.
 */
export const formatDuration = (ms) => {
	const minutes = Math.floor(ms / 60000);
	const seconds = Math.floor((ms % 60000) / 1000);
	return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};
  
/**
   * Format a Spotify URL to extract the ID.
   * @param {string} url - The Spotify URL.
   * @returns {string} - The extracted ID.
   */
export const extractIdFromSpotifyUrl = (url) => {
	const parts = url.split("/");
	return parts[parts.length - 1];
};
  