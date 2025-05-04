import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import darkTheme from "./theme";
import { UserManager } from "./components/UserManager";

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <UserManager />
    </ThemeProvider>
  );
}

export default App;
