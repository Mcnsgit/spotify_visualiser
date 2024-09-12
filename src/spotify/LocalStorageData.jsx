import { SpotifyAccess } from "./SpotifyAccess.jsx";

const SPOTIFY_AUTH_TOKEN = "spotifyAuthToken";
const SPOTIFY_ACCESS = "spotifyAccess";
const SPOTIFY_TOKEN_EXPIRATION_TIME = "spotifyTokenExpirationTime";

export const getSpotifyAccess = () => {
  const access = localStorage.getItem(SPOTIFY_ACCESS);
  if (!access) return null;

  switch (access) {
    case "not_requested":
      return SpotifyAccess.NOT_REQUESTED;
    case "denied":
      return SpotifyAccess.DENIED;
    case "allowed":
      return SpotifyAccess.ALLOWED;
    case "no_premium":
      return SpotifyAccess.NO_PREMIUM;
    default:
      return null;
  }
};

export const setSpotifyAccess = (access) => {
  localStorage.setItem(SPOTIFY_ACCESS, access);
};

export const getSpotifyAccessToken = () => {
  return localStorage.getItem('spotifyAuthToken');
};

export const setSpotifyAccessToken = (token) => {
  localStorage.setItem(SPOTIFY_AUTH_TOKEN, token);
};

export const setSpotifyTokenExpirationTime = (time) => {
  const now = new Date();
  const expirationTime = now.getTime() + Number(time) * 1000;
  localStorage.setItem(SPOTIFY_TOKEN_EXPIRATION_TIME, expirationTime.toString());
};

export const getSpotifyTokenExpirationTime = () => {
  return Number(localStorage.getItem(SPOTIFY_TOKEN_EXPIRATION_TIME));
};
export const storeSpotifyAccessToken = (token) => {
  localStorage.setItem('spotifyAuthToken', token);
};