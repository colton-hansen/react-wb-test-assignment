import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: { main: "#1e3a8a" },
    background: { default: "#f3f4f6", paper: "#ffffff" },
    text: { primary: "#16181d", secondary: "#4b5563" },
    divider: "#e5e7eb",
  },
  typography: {
    fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
    h4: { fontWeight: 650, letterSpacing: "-0.02em" },
    h6: { fontWeight: 650 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
  },
});
