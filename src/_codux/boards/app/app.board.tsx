import React from "react";
import { createBoard } from "@wixc3/react-board";
import App from "../../../App.jsx";
import "../../../App.scss";
import Header from "../../../layout/Header/Header.jsx";

export default createBoard({
  name: "App",
  Board: () => (
    <div>
      <App token={globalToken} />
      <Header />
    </div>
  ),
  isSnippet: true,
  environmentProps: {
    canvasWidth: 1027,
    canvasHeight: 647,
  },
});
