import { useEffect, useState } from 'react';
import { auth } from './firebase';
import axios from 'axios';
import { Drawer, Button, Box, List, ListItem, ListItemText } from '@mui/material';

const PastChatsPage = () => {
  const [chats, setChats] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      // Fetch past chats from backend
      axios.get(`/api/chats/${userId}`)
        .then(response => {
          setChats(response.data);
        })
        .catch(error => {
          console.error('Error fetching chats:', error);
        });
    }
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Drawer (Sidebar) */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <List>
          <ListItem button>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Past Chats" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, marginLeft: '240px', padding: '20px' }}>
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
    </Box>
  );
};

export default PastChatsPage;