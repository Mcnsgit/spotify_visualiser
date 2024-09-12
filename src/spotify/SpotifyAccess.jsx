import axios from 'axios';
export const SpotifyAccess = {
  ALLOWED: "allowed",
  DENIED: "denied",
  NOT_REQUESTED: "not_requested",
  NO_PREMIUM: "no_premium"
};
// SpotifyAccess.jsx

export const getSpotifyAccess = async (token) => {
  const response = await axios.get('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
