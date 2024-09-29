  // Dashboard.jsx
  import React, { useEffect, useState, useContext } from 'react';
  import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
  import  {AuthProvider} from '../../AuthContext';
  import styled from 'styled-components';
  import Header from '../../components/layout/Header/Header';
  import LeftSection from '../../components/layout/SideMenu/leftSection.jsx';
  import axios from 'axios';
  import { Form } from "react-bootstrap";
  import TrackSearchResult from '../../components/layout/Header/trackSearch/trackSearchResults.jsx';
  
  const Dashboard = () => {
    // const { accessToken } = localStorage.getItem('access_token');
    // const [search, setSearch] = useState('');
    // const [searchResults, setSearchResults] = useState([]);
    // const [userData, setUserData] = useState(null);
    // const navigate = useNavigate();
  
    // const fetchAccessToken = useContext(AuthContext);

    

    // useEffect(() => {
      
    //   console.log('useEffect: accessToken:', accessToken);
    //   if (accessToken) {
    //     fetchUserData();
    //   }
    // }, [accessToken]);
  
    // const fetchUserData = async () => {
    //   console.log('fetchUserData: accessToken:', accessToken);
    //   try {
    //     const response = await axios.get('https://api.spotify.com/v1/me', {
    //       headers: { Authorization: `Bearer ${accessToken}` },
    //     });
    //     console.log('fetchUserData: response:', response.data);
    //     setUserData(response.data);
    //   } catch (error) {
    //     console.error('Error fetching user data', error);
    //   }
    // };
  
    // const handleSearch = async (e) => {
    //   console.log('handleSearch: searchQuery:', e.target.value);
    //   const searchQuery = e.target.value;
    //   setSearch(searchQuery);
    //   if (!searchQuery) return;
    //   try {
    //     const response = await axios.get('https://api.spotify.com/v1/search', {
    //       headers: { Authorization: `Bearer ${accessToken}` },
    //       params: { q: searchQuery, type: 'track', limit: 20 },
    //     });
    //     console.log('handleSearch: response:', response.data);
    //     setSearchResults(
    //       response.data.tracks.items.map(track => ({
    //         artist: track.artists[0].name,
    //         title: track.name,
    //         uri: track.uri,
    //         albumUrl: track.album.images[0].url,
    //       }))
    //     );
    //   } catch (error) {
    //     console.error('Error searching tracks', error);
    //   }
    // };
    // <input type="text" placeholder="Search tracks" value={search} onChange={handleSearch} />
          // <div className="search-results">
          //   {searchResults.map(track => (
          //     <TrackSearchResult track={track} key={track.uri} />
          //   ))}
          // </div>
  
    return (
      <DashboardContainer>
        <HeaderContainer>

        </HeaderContainer>
        <BodyContainer>
        
        </BodyContainer>
        <SideMenuContainer>

        </SideMenuContainer>
      </DashboardContainer>
    );
  };
  
  export default Dashboard;
  
  const DashboardContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
  `;

  const HeaderContainer = styled.div`
    .header {
      position: fixed;
      width: 100%;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100px;
      background: rgb(24, 24, 24);
      color: white;
      padding: 0 20px;
    }

    .header-title h1 {
      font-size: 20px;
      font-weight: 600;
    }

    .search-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 50%;
      position: relative;
    }

    .details-container {
      display: flex;
      align-items: center;
      padding-right: 30px;
      background: rgb(24, 24, 24);
      gap: 10px;
    }

    .user-image {
      border-radius: 50%;
      height: 30px;
    }

    .username {
      margin-left: 10px;
    }

    .form {
      font-family: "BioRhyme", serif;
      width: 85%;
      height: 30%;
      background-color: rgba(0, 0, 0, 0.7);
      border: 5px solid #00b4d8;
      color: wheat;
      padding: 1em;
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      float: center;
    }

    input[type="text"] {
      width: 80%;
      padding: 15px;
      margin: 10px 0;
      border: 2px solid #ddd;
      border-radius: 25px;
      outline: none;
      transition: all 0.3s ease-in-out;
      font-size: 16px;
    }

    input[type="text"]:focus {
      border-color: #00b4d8;
      box-shadow: 0 0 10px rgba(0, 180, 216, 0.5);
    }

    button[type="submit"] {
      width: 50%;
      padding: 15px;
      margin: 10px 0;
      border: none;
      border-radius: 25px;
      background-color: #00b4d8;
      color: white;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
    }

    button[type="submit"]:hover {
      background-color: #0077b6;
      box-shadow: 0 0 10px rgba(0, 119, 182, 0.5);
    }

    input[type="submit"]:active {
      transform: scale(0.95);
    }

    input[type="submit"]:focus {
      outline: none;
      box-shadow: 0 0 10px rgba(0, 180, 216, 0.5);
    }
  `;

  const SideMenuContainer = styled.div`
    position: fixed;
    width: 250px;
    font-size: 20px;
    top: 20px;
    height: 100vh;
    background-color: black;
  `;

  const BodyContainer = styled.div`
    flex: 1;
    height: 100vh;
    margin-left: 300px;
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