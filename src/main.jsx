import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ErrorBoundary from "./ErrorBoundary.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import {GlobalStateProvider} from "./context/GlobalStateContext.jsx";
import reducer, { initialState} from "./utils/reducer.jsx";
import {StateProvider} from "./utils/StateProvider.jsx";


ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <Router>
    <GlobalStateProvider>
      <StateProvider initialState={initialState} reducer={reducer}>
          <App />
      </StateProvider>
    </GlobalStateProvider>
    </Router>
  </ErrorBoundary>
);