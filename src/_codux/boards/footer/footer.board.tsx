import React from "react";
import { createBoard } from "@wixc3/react-board";
import Footer from "../../../layout/Footer/Footer.jsx";

export default createBoard({
  name: "Footer",
  Board: () => (
    <div>
      <Footer />
    </div>
  ),
  isSnippet: true,
  environmentProps: {
    canvasMargin: {
      bottom: 0,
      left: 0,
    },
    canvasHeight: 88,
    canvasWidth: 1022,
    canvasBackgroundColor: "#333d36",
  },
});
