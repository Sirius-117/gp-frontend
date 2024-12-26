// Layout.js
import { Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Layout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar (Drawer) */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: 250,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 250,
            boxSizing: 'border-box',
          },
        }}
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
            <Link to="/past-chats" style={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItemText primary="Past Chats" />
            </Link>
          </ListItem>
        </List>
      </Drawer>

      {/* Button to open Sidebar */}
      {/* Place the button inside a condition to ensure it's rendered once */}
      <div style={{ position: 'absolute', zIndex: 1200, top: 20, left: 20 }}>
        {drawerOpen ? (
          // Only show this button when the drawer is open, preventing duplication
          <IconButton
            onClick={() => setDrawerOpen(false)}
            sx={{ zIndex: 1201 }} // Ensure it's always above other elements
          >
            <ChatIcon />
          </IconButton>
        ) : (
          // If drawer is closed, show button to open it
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{ zIndex: 1201 }} // Ensure it's always above other elements
          >
            <ChatIcon />
          </IconButton>
        )}
      </div>

      {/* Main Content (where the route changes) */}
      <div
        style={{
          flexGrow: 1,
          marginLeft: drawerOpen ? 250 : 0,  // Adjust content position based on sidebar state
          marginTop: 0,  // Ensure no shift happens on the vertical axis
          padding: '20px',
          transition: 'margin-left 0.3s ease',  // Smooth transition for margin adjustment
        }}
      >
        {children}  {/* Render the routed content here */}
      </div>
    </div>
  );
};

export default Layout;
