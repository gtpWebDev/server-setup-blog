import NavBar from "./components/layout/NavBar";
import Footer from "./components/layout/Footer";

import { useLocation } from "react-router-dom";

import { Box, CssBaseline } from "@mui/material";

import { NAVBAR_HEIGHT_XS, NAVBAR_HEIGHT_MD } from "./constants/siteConstants";

import { Outlet } from "react-router-dom";
import ScrollToTop from "./components/primitives/ScrollToTop";

/**
 * Parent component containing structure common to the whole website.
 * Intentionally kept to a minimum, so that major sections of website
 * can have tailored styling.
 */

function App() {
  const location = useLocation();

  return (
    <>
      <CssBaseline />
      <ScrollToTop /> {/* Ensures page scrolls to the top on route change */}
      {/* Container with Navbar and Outlet taking full height, and footer additional */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: `calc(100vh - ${NAVBAR_HEIGHT_MD})`, // ensures full screen coverage at least
          marginTop: { xs: NAVBAR_HEIGHT_XS, md: NAVBAR_HEIGHT_MD },
        }}
      >
        <NavBar />
        <Outlet />

        {/* the homepage uses a special layout, and applies the footer locally. */}
        {/* maybe remove this, not sure yet */}
        {/* {location.pathname !== "/" && <Footer />} */}
        <Footer />
      </Box>
    </>
  );
}

export default App;
