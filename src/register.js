import { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from './firebase';
import { TextField, Button, Grid, Typography, Container, Box, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import logo1 from './logo.svg';  // Replace with your actual logo paths
import logo2 from './logo.svg';  // Replace with your actual logo paths

const Register = ({ onRegisterSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        onRegisterSuccess();
      })
      .catch((error) => {
        setError("Error registering: " + error.message);
      });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
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

        <Typography variant="h5" color="primary" sx={{ marginBottom: 3, zIndex: 2 }}>
          Create an Account
        </Typography>

        <form onSubmit={handleRegister} style={{ width: '100%' }}>
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
                '&:hover fieldset': { borderColor: '#90caf9' },  // Lighter hover border
                '&.Mui-focused fieldset': { borderColor: '#90caf9' }  // Focus border color
              },
              '& .MuiInputBase-root': { color: '#fff' },  // White text color
              zIndex: 2, // Ensure the input field is above the logos
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
                '&:hover fieldset': { borderColor: '#90caf9' },  // Lighter hover border
                '&.Mui-focused fieldset': { borderColor: '#90caf9' }  // Focus border color
              },
              '& .MuiInputBase-root': { color: '#fff' },  // White text color
              zIndex: 2, // Ensure the input field is above the logos
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

          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            fullWidth
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            variant="outlined"
            sx={{
              borderRadius: 2,
              backgroundColor: '#333',  // Dark input field
              '& .MuiInputLabel-root': { color: '#ccc' },  // Lighter label color
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#555' },  // Lighter border
                '&:hover fieldset': { borderColor: '#90caf9' },  // Lighter hover border
                '&.Mui-focused fieldset': { borderColor: '#90caf9' }  // Focus border color
              },
              '& .MuiInputBase-root': { color: '#fff' },  // White text color
              zIndex: 2, // Ensure the input field is above the logos
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowConfirmPassword} edge="end">
                    {showConfirmPassword ? <VisibilityOff sx={{ color: '#fff' }} /> : <Visibility sx={{ color: '#fff' }} />}
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
              backgroundColor: '#90caf9', // Accent color for the button
              '&:hover': {
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              },
              zIndex: 2, // Ensure the button is above the logos
            }}
          >
            Register
          </Button>

          <Grid container justifyContent="flex-end" sx={{ marginTop: 2 }}>
            <Grid item>
              <Button
                variant="text"
                onClick={() => window.location.href = '/sign-in'}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  color: '#fff', // White text for the link
                  '&:hover': { textDecoration: 'underline', color: '#90caf9' },
                  zIndex: 2, // Ensure the link is above the logos
                }}
              >
                Already have an account? Sign In
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
