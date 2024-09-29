// Authenticate.jsx
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import axios from 'axios';

const AuthHandler = () => {
  const navigate = useNavigate();
  const { setAccessToken, setRefreshToken, setExpiresIn } = useContext(AuthContext);

  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      axios
        .post('<http://localhost:3001/callback>', { code })
        .then((response) => {
          const { access_token, refresh_token, expires_in } = response.data;
          setAccessToken(access_token);
          setRefreshToken(refresh_token);
          setExpiresIn(expires_in);
          window.history.replaceState({}, document.title, '/');
          navigate('/dashboard');
        })
        .catch((err) => {
          console.error('Error exchanging code for tokens:', err.response.data);
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [navigate, setAccessToken, setRefreshToken, setExpiresIn]);

  return <div>Loading...</div>;
};

export default AuthHandler;