import { createTheme } from "@mui/material/styles";

const SiteTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3F51B5", // Deep indigo
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#00CFFD", // Bright cyan
      contrastText: "#000000",
    },
    background: {
      default: "#121212", // Very dark base
      paper: "#1E1E1E",
    },
    text: {
      primary: "#E0E0E0", // Light grey for body
      secondary: "#AAAAAA", // Muted grey
    },
    warning: {
      main: "#FF9800", // Vivid orange
    },
    error: {
      main: "#EF5350", // Strong red
    },
    success: {
      main: "#00E676", // Neon green
    },
    info: {
      main: "#40C4FF", // Sky blue
    },
    tradeColours: {
      bondCurveBuy: {
        textColor: "#000000",
        backgroundColor: "rgb(110, 215, 115)",
      },
      bondCurveSell: {
        textColor: "#000000",
        backgroundColor: "rgb(193, 25, 25)",
      },
      uniswapBuy: {
        textColor: "#000000",
        backgroundColor: "#c8facc",
      },
      uniswapSell: {
        textColor: "#660000",
        backgroundColor: "#ffc9c9",
      },
      bondCurveGraduate: {
        textColor: "rgb(9, 12, 74)",
        backgroundColor: "rgb(255, 255, 255)",
      },
    },
  },
  typography: {
    fontFamily: `'Inter', 'Roboto', 'Arial', sans-serif`,
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      color: "#FFFFFF",
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 600,
      color: "#D1C4E9", // Light lavender
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 500,
      color: "#B39DDB",
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      color: "#CCCCCC",
    },
    button: {
      fontSize: "1rem",
      fontWeight: 600,
      textTransform: "uppercase",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          textTransform: "none",
          padding: "10px 22px",
          boxShadow: "0px 2px 8px rgba(138, 43, 226, 0.3)",
        },
        containedPrimary: {
          background: "linear-gradient(90deg, #8A2BE2 0%, #00CFFD 100%)",
          color: "#fff",
          "&:hover": {
            background: "linear-gradient(90deg, #6A1B9A 0%, #0097A7 100%)",
          },
        },
        outlinedPrimary: {
          borderColor: "#8A2BE2",
          color: "#8A2BE2",
          "&:hover": {
            borderColor: "#6A1B9A",
            color: "#6A1B9A",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#1F1B24",
          color: "#FFFFFF",
          borderRadius: "14px",
          boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.4)",
          borderLeft: "5px solid #00CFFD",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1E1E1E",
          color: "#FFFFFF",
          borderBottom: "1px solid #8A2BE2",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#292929",
            "& fieldset": {
              borderColor: "#8A2BE2",
            },
            "&:hover fieldset": {
              borderColor: "#BA68C8",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#00CFFD",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#CCCCCC",
          },
        },
      },
    },
  },
});

export default SiteTheme;
