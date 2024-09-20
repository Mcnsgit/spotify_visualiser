import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { Navigate } from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react';
import ErrorBoundary from "./ErrorBoundary.jsx";
import {GlobalStateProvider} from "./context/GlobalStateContext.jsx";
import reducer, { initialState} from "./utils/reducer.jsx";
import {StateProvider} from "./utils/StateProvider.jsx";
import App from './App.jsx'
import PrivateRoute from './components/PrivateRoute.jsx';
import Login from "./screens/Login/Login.jsx";
import Dashboard from "./screens/Dashboard/Dashboard.jsx";
import { AuthProvider } from './AuthContext.jsx';
// import Library from "./screens/library/Library.jsx";
// import Visualizer from "./layout/MainSection/Visualiser/Visualizer.jsx";
// import Favorites from "./screens/favorites/Favorites.jsx";
// import Player from "./screens/Player/Player.jsx";
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <GlobalStateProvider>
          <StateProvider initialState={initialState} reducer={reducer}>
            <ChakraProvider>
              <Router>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/App" element={<App />}/>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Router>
            </ChakraProvider>
          </StateProvider>
        </GlobalStateProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);