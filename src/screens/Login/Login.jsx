import React from 'react';
import './login.css';

const Login = () => {
  const handleLogin = () => {
  window.location.href = `http://localhost:3001/login`; // Redirects to backend
};

return (
  <div className='login-container'>

    <h1 className='login-title'>Spotify Authentication</h1>
      
    <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_Black.png" alt="Spotify logo" className="login-logo" />
    <button className='login-button' onClick={handleLogin}>Log in with Spotify</button>
  </div>
);  
};

export default Login;

