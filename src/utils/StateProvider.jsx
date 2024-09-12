import React, { createContext, useContext, useReducer } from "react";
import PropTypes from "prop-types";
import { reducer, initialState } from "../context/globalStateUtils";

const StateContext = createContext();

export const StateProvider = ({ children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

StateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useStateProvider = () => useContext(StateContext);
