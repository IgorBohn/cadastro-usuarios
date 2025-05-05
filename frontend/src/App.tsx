import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import darkTheme from "./theme";
import { UserPage } from "./pages/UserPage";

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <UserPage />
    </ThemeProvider>
  );
}

export default App;
