// src/App.jsx
import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { AuthProvider } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import Login from './screens/Login/Login';
import Dashboard from './screens/Dashboard/Dashboard';
import AuthHandler from './utils/useAuth'; // Ensure correct import path
import axios from 'axios';
import './App.css';

const code = new URLSearchParams(window.location.search).get('code');

const App = () => {
  const accessToken = code

  return code ? <Dashboard accessToken={accessToken} /> : <Login />;





  
  };

export default App;
