import React, { useState, useEffect } from 'react';
import './App.css';
import MainPage from './MainPage';
import ProfilePage from './profilepage'; // Import ProfilePage
import PastChatsPage from './pastchatspage'; // Import PastChatsPage
import SignIn from './sign_in';
import Register from './register';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { auth, onAuthStateChanged } from './firebase';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout';

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
  const [user, setUser] = useState(null); // user state to track logged-in user
  const [isRegistering, setIsRegistering] = useState(false); // Track if we're on the Register page

  useEffect(() => {
    // Track the user authentication status using Firebase
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set user if authenticated
      } else {
        setUser(null); // Clear user if not authenticated
      }
    });

    // Cleanup the listener when component unmounts
    return () => unsubscribe();
  }, []);

  // Handle successful sign-in
  const handleSignInSuccess = () => {
    console.log('Sign-in successful');
    setUser(auth.currentUser); // Set user after successful sign-in
  };

  // Handle successful registration
  const handleRegisterSuccess = () => {
    console.log('Registration successful');
    setUser(auth.currentUser); // Set user after successful registration
  };

  // If the user is authenticated, render the main page and routes
  if (user) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Router>
          {/* Wrap the app with Router */}
          <div className="App">
            <Routes>
              {/* Define your routes here */}
              <Route path="/" element={<MainPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route
                path="/past-chats"
                element={<PastChatsPage user={user} />}
              />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    );
  }

  // If we're on the Register page, show the Register form
  if (isRegistering) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div className="App">
          <Register onRegisterSuccess={handleRegisterSuccess} />
        </div>
      </ThemeProvider>
    );
  }

  // If we're on the SignIn page, show the SignIn form
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <SignIn
          onSignInSuccess={handleSignInSuccess}
          setIsRegistering={setIsRegistering}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
