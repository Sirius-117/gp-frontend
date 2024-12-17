import { useEffect, useState } from 'react';
import { auth } from './firebase';
import axios from 'axios';
import ChatIcon from '@mui/icons-material/Chat';
import { Link } from 'react-router-dom';
import { Drawer, Button, Box, List, ListItem, ListItemText, IconButton } from '@mui/material';

const PastChatsPage = () => {
  const [chats, setChats] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const [socket, setSocket] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      // Fetch past chats from backend
      axios.get(`ws://localhost:8000/ws/chat/${userId}`)
        .then(response => {
          setChats(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching chats:', error);
          setError('Error fetching chats');
          setLoading(false);
        });
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
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
      <Box sx={{ flexGrow: 1, padding: '20px' }}>  {/* Adjusted marginLeft */}
       <Button onClick={toggleDrawer}>Toggle Sidebar</Button>
        <h2>Past Chats</h2>
        {chats.length > 0 ? (
          chats.map((chat, index) => (
            <div key={index}>
              <p>{chat.date}</p>
              <p>{chat.content}</p>
            </div>
          ))
        ) : (
          <p>No past chats available.</p>
        )}
      </Box>
    </div>
  );
};

export default PastChatsPage;