import { useEffect, useState } from 'react';
import { auth } from './firebase';  // Firebase auth
import { updateProfile } from 'firebase/auth';  // Import updateProfile from Firebase auth
import { Drawer, List, ListItem, ListItemText, IconButton, TextField, Button } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newName, setNewName] = useState('');  // State to hold new name input
  const [loading, setLoading] = useState(false); // To show loading state during update

  useEffect(() => {
    const user = auth.currentUser;  // Get the current logged-in user from Firebase

    if (user) {
      setUserInfo({
        name: user.displayName || '',  // Use displayName if available, else use empty string
        email: user.email,  // Get user's email
      });
      setNewName(user.displayName || '');  // Set the current name in the input field
    } else {
      console.log("No user logged in");
    }
  }, []);

  const handleNameChange = (e) => {
    setNewName(e.target.value);  // Update name input field value
  };

  const handleUpdateName = () => {
    const user = auth.currentUser;

    if (user) {
      setLoading(true);
      updateProfile(user, {
        displayName: newName,  // Update the user's display name
      })
      .then(() => {
        setUserInfo(prev => ({ ...prev, name: newName }));  // Update the name in the state
        setLoading(false);  // Stop loading
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        setLoading(false);  // Stop loading in case of error
      });
    }
  };

  return (
    <div>
      {/* Sidebar (Drawer) */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ width: 250, flexShrink: 0 }}
      >
        <List>
          <ListItem button onClick={() => setDrawerOpen(false)}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItemText primary="Home" />
            </Link>
          </ListItem>
          <ListItem button onClick={() => setDrawerOpen(false)}>
            <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItemText primary="Profile" />
            </Link>
          </ListItem>
          <ListItem button onClick={() => setDrawerOpen(false)}>
            <Link to="/memory" style={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItemText primary="Past Chats" />
            </Link>
          </ListItem>
        </List>
      </Drawer>

      {/* Button to open Sidebar */}
      <IconButton onClick={() => setDrawerOpen(true)} sx={{ position: 'absolute', top: '20px', left: '20px' }}>
        <ChatIcon />
      </IconButton>

      {/* Main Content */}
      <div style={{ marginLeft: 250, marginTop: '64px', padding: '20px' }}>
        <h2>Profile</h2>
        {userInfo ? (
          <div>
            <div>
              <p>Email: {userInfo.email}</p>
              <TextField
                label="Name"
                value={newName}  // Controlled input for name
                onChange={handleNameChange}  // Handle name changes
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateName}
                disabled={loading}  // Disable button while loading
                sx={{ marginTop: '10px' }}
              >
                {loading ? 'Updating...' : 'Update Name'}
              </Button>
            </div>
          </div>
        ) : (
          <p>Loading user information...</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
