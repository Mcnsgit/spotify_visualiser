// src/main.jsx
import React from 'react';
// import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import ErrorBoundary from './ErrorBoundary.jsx';
import { AuthProvider } from './AuthContext.jsx';
import App from './App.jsx';
import Login from './screens/Login/Login.jsx';
import Dashboard from './screens/Dashboard/Dashboard.jsx';
import Callback from './Callback.jsx';
import './App.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <AuthProvider>
      <ChakraProvider>
<Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<App />} />
          <Route path="*" element={<App />} />
    </Routes>
        </Router>

      </ChakraProvider>
    </AuthProvider>
  </ErrorBoundary>
);
