const TokenService = {getAccessToken() {
  return localStorage.getItem('access_token');
},

setAccessToken(token) {
  localStorage.setItem('access_token', token);
},

removeAccessToken() {
  localStorage.removeItem('access_token');
},

getRefreshToken() {
  return localStorage.getItem('refresh_token');
},

setRefreshToken(token) {
  localStorage.setItem('refresh_token', token);
},

removeRefreshToken() {
  localStorage.removeItem('refresh_token');
},

getExpiryTime() {
  return localStorage.getItem('expires_in');
},

setExpiryTime(time) {
  const now = new Date();
  const expiry = new Date(now.getTime() + (time * 1000));
  localStorage.setItem('expires_in', expiry);
},

removeExpiryTime() {
  localStorage.removeItem('expires_in');
},

isTokenExpired() {
  const expiryTime = TokenService.getExpiryTime();
  if (!expiryTime) {
    return true;
  }
  const now = new Date();
  return now.getTime() > expiryTime;
},

isRefreshTokenExpired() {
  const refreshToken = TokenService.getRefreshToken();
  if (!refreshToken) {
    return true;
  }
  const expiryTime = TokenService.getExpiryTime();
  if (!expiryTime) {
    return true;
  }
  const now = new Date();
  return now.getTime() > expiryTime;
},

clearTokens() {
  TokenService.removeAccessToken();
  TokenService.removeRefreshToken();
  TokenService.removeExpiryTime();
},  
};

export const currentToken = {
  get access_token() {
    return localStorage.getItem('access_token') || null;
  },
  get refresh_token() {
    return localStorage.getItem('refresh_token') || null;
  },
  get expires() {
    return new Date(localStorage.getItem('expires')) || null;
  },
  save(response) {
    const { access_token, refresh_token, expires_in } = response;
    const expiryDate = new Date(Date.now() + expires_in * 1000);
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('expires', expiryDate);
  },
  clear() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires');
  }
};


export default TokenService;
