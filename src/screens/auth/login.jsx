import React from "react";
import { loginEndpoint } from "../../api/ApiClient";
import AuthService from "../../services/AuthService";

// const Login = () => {
//   const handleLoginClick = () => {
//     AuthService.redirectToSpotifyAuthorize();
//   };

//   return (
//     <div className="login-page">
//       <h1>Login with Spotify</h1>
//       <button onClick={handleLoginClick}>Login with Spotify</button>
//     </div>
//   );
// };

// export default Login;

export default function Login() {
  return (
    <div className="login-page">
      <img
        src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png"
        alt="Spotify logo"
        className="logo"
      />
      <a className="btn-spotify" href="https://localhost:3001/auth/login">
        LOG IN WITH SPOTIFY
      </a>
    </div>
  );
}
