import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, CardMedia, Button, CircularProgress, IconButton  } from '@mui/material';
import { Chat as ChatIcon, Close as CloseIcon } from '@mui/icons-material';
import Chat from './chat';

const MainPage = () => {
 const [videoData, setVideoData] = useState([]);
 const [loading, setLoading] = useState(true);
 const [chatOpen, setChatOpen] = useState(true); // Whether the chatbot is open or minimized
 const [chatWidth, setChatWidth] = useState(4); // The width of the chatbot panel (out of 12 columns)
 const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    // Fetch video data from the backend
    const fetchVideoData = async () => {
      try {
        const response = await fetch('ws://localhost:8000/ws/chat'); // Adjust the API route as necessary
        const data = await response.json();
        setVideoData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching video data:', error);
        setLoading(false);
      }
    };

    fetchVideoData();
  }, []);

  // Handle resizing the chatbot panel by dragging
  const handleMouseDown = () => setIsResizing(true);
  const handleMouseUp = () => setIsResizing(false);
  const handleMouseMove = (e) => {
    if (isResizing) {
      const newWidth = Math.min(Math.max(2, Math.floor((window.innerWidth - e.clientX) / (window.innerWidth / 12))), 6);
      setChatWidth(newWidth);
    }
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);



  return (
    <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', padding: '20px', flexGrow: 1, height: '100%' }}>
        
        {/* Video Cards Section */}
        <Box sx={{ flex: chatOpen ? 12 - chatWidth : 12, overflowY: 'auto' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              {videoData.map((video, index) => (
                <Box key={index} sx={{ width: { xs: '100%', md: '48%' } }}>
                  <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={video.thumbnail_url} // Assume there's a thumbnail_url in your MongoDB data
                      alt={video.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6">{video.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {video.description}
                      </Typography>
                    </CardContent>
                    <Button
                      variant="contained"
                      href={`https://www.youtube.com/watch?v=${video.video_id}`} // Assume there's a video_id in the video data
                      target="_blank"
                      sx={{ margin: '10px' }}
                    >
                      Watch Video
                    </Button>
                  </Card>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Resizable Chatbot Section */}
        {chatOpen && (
          <Box
            sx={{
              flex: chatWidth,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              borderLeft: '1px solid #ccc',
            }}
          >
            <Chat />

            {/* Drag handle for resizing */}
            <Box
              onMouseDown={handleMouseDown}
              sx={{ cursor: 'col-resize', width: '10px', position: 'absolute', left: '-5px', top: 0, bottom: 0, zIndex: 1, backgroundColor: 'transparent' }}
            />

            {/* Minimize button */}
            <IconButton
              onClick={() => setChatOpen(false)}
              sx={{ position: 'absolute', top: '10px', right: '10px' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        )}

      </Box>

      {/* Minimized Chat Bubble */}
      {!chatOpen && (
        <IconButton
          onClick={() => setChatOpen(true)}
          sx={{ position: 'fixed', bottom: '20px', right: '20px', backgroundColor: '#3f51b5', color: 'white', zIndex: 1000 }}
        >
          <ChatIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default MainPage;