import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AuthService from "./services/AuthService.jsx";
import { useStateProvider } from "./utils/StateProvider.jsx";
import { GlobalStateProvider } from "./context/GlobalStateContext.jsx";
import { reducerCases } from "./utils/Constants.jsx";
import Dashboard from "./screens/Dashboard/Dashboard.jsx";
import Library from "./screens/library/Library.jsx";
import AudioPlayer from "./screens/Player/audioPlayer/index.jsx"; // Fixed casing
import Login from "./screens/auth/login.jsx";
import Visualizer from "./layout/MainSection/Visualiser/Visualiser.jsx";
import "./App.scss";
import { setClientToken } from "./api/ApiClient.jsx"; 
import instance from "./utils/axios.jsx";
import Favorites from "./screens/favorites/Favorites.jsx";
import Player from "./screens/Player/Player.jsx";
import WebPlayback from "./spotify/WebSDKPlayer.jsx";
import useSpotify from "./hooks/useSpotify.jsx";
// export default function App() {
//   const [{ token }, dispatch] = useStateProvider();
//   const [loading, setLoading] = useState(true); 
//   const navigate = useNavigate();
  
//   useEffect(() => {
//     const authenticateUser = async () => {
//         const params = new URLSearchParams(window.location.search);
//         const code = params.get('code');

//         if (!token) {
//           if (code) {
//             try {
//               const tokenData = await AuthService.getToken(code);
//               AuthService.currentToken.save(tokenData);
//               dispatch({ type: "SET_TOKEN", token: tokenData.access_token });
//               window.history.replaceState({}, document.title, '/'); // Clean URL
//               navigate("/dashboard");
//             } catch (error) {
//               console.error("Authentication failed", error);
//               AuthService.redirectToSpotifyAuthorize();
//             }
//           } else {
//             AuthService.redirectToSpotifyAuthorize();
//           }
//         } else {
//           navigate("/dashboard");
//         }
//         setLoading(false);
//       };
  
//       authenticateUser();
//     }, [dispatch, token, navigate]);
  


//   if (loading) {
//     return <div>Loading...</div>;
//   }

const App = () => {
  const [{ token }, dispatch] = useStateProvider();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to authenticate the user
  const authenticateUser = async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    // Check if token is already set
    if (!token) {
      if (code) {
        try {
          const tokenData = await AuthService.getToken(code);
          AuthService.currentToken.save(tokenData);
          dispatch({ type: "SET_TOKEN", token: tokenData.access_token });
          window.history.replaceState({}, document.title, '/'); // Clean URL
          navigate("/dashboard");
        } catch (error) {
          console.error("Authentication failed", error);
          AuthService.redirectToSpotifyAuthorize();
        }
      } else {
        AuthService.redirectToSpotifyAuthorize();
      }
    } else {
      navigate("/dashboard");
    }

    setLoading(false);
  };

  // Call authenticateUser on mount
  useEffect(() => {
    authenticateUser();
  }, [token, navigate, dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <div className="main-body">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={token ? <Dashboard /> : <Login />} />
          <Route path="/library" element={<Library />} />
          <Route path="/visualiser" element={<Visualizer />} />
          <Route path="/player" element={<Player />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;

//           const token = window.localStorage.getItem("token");
//           const hash = window.location.hash;
//           window.location.hash = "";
//           if (!token && hash) {
//             const _token = hash.split("&")[0].split("=")[1];
//             window.localStorage.setItem("token", _token);
//             setToken(_token);
//             setClientToken(_token);
//           } else {
//             setToken(token);
//             setClientToken(token);
//           }
//           }, []);
