import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";

import { RefreshProvider } from "./context/RefreshContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RefreshProvider interval={60000}> {/* central polling interval */}
      <App />
    </RefreshProvider>
  </React.StrictMode>
);
