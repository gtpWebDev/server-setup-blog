import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// css has limited impact, mainly global font fallbacks and scrollbars
import "./index.css";

import { ThemeProvider } from "@mui/material/styles";
import SiteTheme from "./styles/SiteTheme";

import routes from "./routes";

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={SiteTheme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
