// src/screens/Dashboard/Dashboard.jsx
import React, { useEffect, useState, useRef, useContext } from "react";
import styled from "styled-components";
import "../../App.css";
import Header from "../../components/layout/Header/Header";
import Body from "./Body";
import SpotifyWebApi from "spotify-web-api-js";
import { AuthContext } from "../../AuthContext";
import { refreshAccessToken, getUserData } from '../../utils/spotifyAPI';

const UserProfile = ({ userData }) => (
  <div id="user-profile">
    <h1>Logged in as {userData.display_name}</h1>
    <div className="media">
      <div className="pull-left">
        <img className="media-object" width="150" src={userData.images[0]?.url} alt="Profile" />
      </div>
      <div className="media-body">
        <dl className="dl-horizontal">
          <dt>Display name</dt><dd>{userData.display_name}</dd>
          <dt>Id</dt><dd>{userData.id}</dd>
          <dt>Email</dt><dd>{userData.email}</dd>
          <dt>Spotify URI</dt><dd><a href={userData.external_urls.spotify}>{userData.external_urls.spotify}</a></dd>
          <dt>Link</dt><dd><a href={userData.href}>{userData.href}</a></dd>
          <dt>Profile Image</dt><dd><a href={userData.images[0]?.url}>{userData.images[0]?.url}</a></dd>
          <dt>Country</dt><dd>{userData.country}</dd>
        </dl>
      </div>
    </div>
  </div>
);

const OAuthInfo = ({ accessToken, refreshToken }) => (
  <div id="oauth">
    <h2>OAuth info</h2>
    <dl className="dl-horizontal">
      <dt>Access token</dt><dd className="text-overflow">{accessToken}</dd>
      <dt>Refresh token</dt><dd className="text-overflow">{refreshToken}</dd>
    </dl>
  </div>
);

const Dashboard = () => {
  const { accessToken, refreshToken, setAccessToken: setAccessTokenContext } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const bodyRef = useRef();

  useEffect(() => {
    if (!accessToken) {
      console.error('Access token is missing');
      return;
    }

    const fetchUserData = async () => {
      try {
        const data = await getUserData(accessToken);
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error fetching user data');
      }
    };

    fetchUserData();
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken || !refreshToken) return;

    const refreshTokenInterval = setInterval(async () => {
      try {
        await refreshAccessToken(refreshToken, setAccessTokenContext);
      } catch (error) {
        console.error('Error refreshing access token:', error);
      }
    }, 1000 * 60 * 50); // Refresh every 50 minutes

    return () => clearInterval(refreshTokenInterval);
  }, [accessToken, refreshToken, setAccessTokenContext]);

  return (
    <DashboardContainer>
      <Header />
      <BodyContainer ref={bodyRef}>
        {!userData ? (
          <div id="login">
            <h1>This is an example of the Authorization Code flow</h1>
            <a href="/login" className="btn btn-primary">Log in with Spotify</a>
          </div>
        ) : (
          <div id="loggedin">
            <UserProfile userData={userData} />
            <OAuthInfo accessToken={accessToken} refreshToken={refreshToken} />
            <button
              className="btn btn-default"
              id="obtain-new-token"
              onClick={async () => {
                try {
                  const newAccessToken = await refreshAccessToken(refreshToken);
                  setAccessTokenContext(newAccessToken);
                } catch (error) {
                  console.error('Error obtaining new token:', error);
                }
              }}
            >
              Obtain new token using the refresh token
            </button>
          </div>
        )}
        {error && <div className="error">{error}</div>}
      </BodyContainer>
    </DashboardContainer>
  );
};

export default Dashboard;
//   const { accessToken, refreshToken, setAccessToken: setAccessTokenContext } = useContext(AuthContext);
//   const [userData, setUserData] = useState(null);
//   const bodyRef = useRef();
//   const [headerBackground, setHeaderBackground] = useState(false);
//   const [view, setView] = useState("search");

//   useEffect(() => {
//     if (!accessToken) {
//       console.error('Access token is missing');
//       history.push('/login'); // Use history for navigation
//       return;
//     }

//     const fetchUserData = async () => {
//       try {
//         const data = await getUserData(accessToken);
//         setUserData(data);
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };
//     fetchUserData();
//   }, [accessToken, history]);

//   useEffect(() => {
//     if (!accessToken || !refreshToken) return;

//     const refreshTokenInterval = setInterval(async () => {
//       try {
//         await refreshAccessToken(refreshToken, setAccessTokenContext);
//       } catch (error) {
//         // Optionally handle error (e.g., redirect to login)
//       }
//     }, 1000 * 60 * 50); // Refresh every 50 minutes

//     return () => clearInterval(refreshTokenInterval);
//   }, [accessToken, refreshToken, setAccessTokenContext]);

//   return (
//     <div className="h-screen bg-black">
//       <div className="h-[90%] flex">
//         <DashboardContainer>
//           <Header
//             headerBackground={headerBackground}
//             userData={userData}
//           />
//           <BodyContainer ref={bodyRef}>
//             <Body
//               view={view}
//               accessToken={accessToken}
//             />
//           </BodyContainer>
//         </DashboardContainer>
//       </div>
//     </div>
//   );
// }

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;

const BodyContainer = styled.div`
  flex: 1;
  height: 100vh;
  overflow-y: auto;
  background: linear-gradient(transparent, rgba(0, 0, 0, 1));
  background-color: rgb(32, 70, 60);
  &::-webkit-scrollbar {
    width: 0.7rem;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.6);
  }
`;

