import axios from 'axios';

const AuthService = {
  currentToken: {
    save(tokenData) {
      localStorage.setItem('access_token', tokenData.access_token);
      localStorage.setItem('refresh_token', tokenData.refresh_token);
    },
    get() {
      return localStorage.getItem('access_token');
    },
    getRefreshToken() {
      return localStorage.getItem('refresh_token');
    },
    clear() {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },
  
  async getToken(code) {
    // Get the token using the authorization code
    const response = await axios.post('https://localhost:3001/callback', {
      code,
    });
    return response.data;
  },

  async refreshToken() {
    const refreshToken = this.currentToken.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await axios.post('https://localhost:3001/auth/refresh_token', {
        refresh_token: refreshToken,
      });
      this.currentToken.save(response.data);
      return response.data.access_token;
    } catch (error) {
      console.error("Failed to refresh token", error);
      throw error;
    }
  },

  redirectToSpotifyAuthorize() {
    window.location.href = 'https://accounts.spotify.com/authorize?...'; // Add your params here
  },

  logout() {
    this.currentToken.clear();
    window.location.href = '/login';
  }
};

export default AuthService;