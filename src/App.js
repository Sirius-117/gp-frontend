//import logo from './logo.svg';
import './App.css';
import React from 'react';
import MainPage from './MainPage'; // Import the MainPage component
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});


function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* Ensures dark background and light text */}
      <div className="App">
      <MainPage />
      </div>
    </ThemeProvider>
  );
}

export default App;
