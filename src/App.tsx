import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import ThemeProvider from "@mui/material/styles/ThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";

import CardList from "./CardList";
import CardEdit from "./CardEdit";

// Utils
import theme from "./theme/theme";

const App = () => 
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<CardList />}/>
          <Route path="/card_edit" element={<CardEdit />}/>
        </Routes>
    </Router>
    </ThemeProvider>

export default App;
