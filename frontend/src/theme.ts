import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    primary: {
      main: "#ffffff",
    },
    secondary: {
      main: "#bbbbbb",
    },
    error: {
      main: "#f44336",
    },
  },
  typography: {
    allVariants: {
      color: "#ffffff",
    },
  },
});

export default darkTheme;
