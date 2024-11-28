// Layout.js
import { Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Layout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

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

      {/* Main Content (where the route changes) */}
      <div style={{ marginLeft: 250, marginTop: '64px', padding: '20px' }}>
        {children}  {/* Render the routed content here */}
      </div>
    </div>
  );
};

export default Layout;
