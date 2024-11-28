import { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from './firebase';
import { TextField, Button, Grid, Typography, Container, Box, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import logo1 from './logo.svg';  // Replace with your actual logo paths
import logo2 from './logo.svg';  // Replace with your actual logo paths

const SignIn = ({ onSignInSuccess, setIsRegistering }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = (e) => {
    e.preventDefault();
    setError('');
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        const userId = auth.currentUser.uid;
        onSignInSuccess(userId);  // Pass the user ID on successful sign-in
      })
      .catch((error) => {
        setError("Error signing in: " + error.message);
      });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 8,
        backgroundColor: '#232324', // Dark background color
        borderRadius: '10px',
        padding: '20px',
        boxShadow: 3,
        position: 'relative',
        overflow: 'hidden',  // Ensures logos don't spill outside the container
      }}>
        {/* Background Logos */}
        <Box sx={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundImage: `url(${logo1}), url(${logo2})`,
          backgroundSize: '100px 100px',  // Adjust size of logos
          backgroundPosition: 'top left, bottom right',
          backgroundRepeat: 'no-repeat',
          opacity: 0.1,  // To make logos light and not obstruct content
          zIndex: 1,  // Make sure logos are behind the form content
        }}></Box>

        <Typography variant="h5" sx={{ color: '#90caf9', marginBottom: 3, zIndex: 2 }}>
          Sign In
        </Typography>

        <form onSubmit={handleSignIn} style={{ width: '100%' }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            variant="outlined"
            sx={{
              borderRadius: 2,
              backgroundColor: '#333',  // Dark input field
              '& .MuiInputLabel-root': { color: '#ccc' },  // Lighter label color
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#555' },  // Lighter border
                '&:hover fieldset': { borderColor: '#90caf9' },  // Blue hover border
                '&.Mui-focused fieldset': { borderColor: '#90caf9' }  // Blue focus border
              },
              '& .MuiInputBase-root': { color: '#fff' },  // White text color
              zIndex: 2, // Make sure the input field is on top
            }}
          />

          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            variant="outlined"
            sx={{
              borderRadius: 2,
              backgroundColor: '#333',  // Dark input field
              '& .MuiInputLabel-root': { color: '#ccc' },  // Lighter label color
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#555' },  // Lighter border
                '&:hover fieldset': { borderColor: '#90caf9' },  // Blue hover border
                '&.Mui-focused fieldset': { borderColor: '#90caf9' }  // Blue focus border
              },
              '& .MuiInputBase-root': { color: '#fff' },  // White text color
              zIndex: 2, // Make sure the input field is on top
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff sx={{ color: '#fff' }} /> : <Visibility sx={{ color: '#fff' }} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error && <Typography color="error" variant="body2" sx={{ marginTop: 1, zIndex: 2 }}>{error}</Typography>}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              marginTop: 2,
              borderRadius: '30px',
              padding: '12px',
              boxShadow: 3,
              backgroundColor: '#90caf9', // Blue button color
              '&:hover': {
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              },
              zIndex: 2, // Make sure button stays above the logos
            }}
          >
            Sign In
          </Button>

          <Grid container justifyContent="flex-end" sx={{ marginTop: 2 }}>
            <Grid item>
              <Button
                variant="text"
                onClick={() => setIsRegistering(true)}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  color: '#fff', // Blue text for the link
                  '&:hover': { textDecoration: 'underline', color: '#90caf9' },
                  zIndex: 2, // Ensure the link is on top
                }}
              >
                Don't have an account? Sign Up
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default SignIn;
