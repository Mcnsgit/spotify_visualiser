import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const Callback = () => {
  const navigate = useNavigate();
  const { setAccessToken , setRefreshToken, setExpiresIn } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const code = params.get('code '); 

    if (code)  {
      axios.post('http://localhost:3001/callback', { code })
      .then(response => {
        const { access_token, refresh_token, expires_in } = response.data;
        setAccessToken(access_token);
        setRefreshToken(refresh_token);
        setExpiresIn(expires_in);
        const token = response.data.access_token;
        localStorage.setItem('token', token);
        navigate('/dashboard');
      })
      .catch(error => {
        console.error('Error exchanging code for token:', error);
        navigate('/login');
      });
    } else {
      navigate('/dashboard');
    }
  }, [navigate, setAccessToken, setRefreshToken, setExpiresIn]);

  return <div>Loading...</div>;
};

export default Callback;