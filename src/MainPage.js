//src/MainPage.js
import React, { useState, useEffect, useRef } from 'react';
import { Box, Card, CardContent, Typography, CardMedia, CircularProgress, Button, IconButton  } from '@mui/material';
import { Chat as ChatIcon, Close as CloseIcon } from '@mui/icons-material';
import Chat from './chat';

const MainPage = () => {
 const [videoData, setVideoData] = useState([]);
 const [loading, setLoading] = useState(true);
 const [chatOpen, setChatOpen] = useState(true); // Whether the chatbot is open or minimized
 const [chatWidth, setChatWidth] = useState(4); // The width of the chatbot panel (out of 12 columns)
 const [isResizing, setIsResizing] = useState(false);
 const videoSocket = useRef(null);
 const processedLinks = useRef(new Set()); // Use a ref to store processed links
 const resizeTimeout = useRef(null); // Ref for the resize timeout
 const [messages, setMessages] = useState([]); // Store chat messages in state

  useEffect(() => {
    console.log("MainPage component mounted"); // Log when the component mounts

    // WebSocket connection setup
    videoSocket.current = new WebSocket('ws://localhost:8000/ws/chat');
    console.log("Attempting to open WebSocket");

    videoSocket.current.onopen = () => {
      console.log("WebSocket connection opened");
    };

    videoSocket.current.onmessage = (event) => {
      const newMessage = event.data;
      console.log("Message received:", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Append new messages
    };

    videoSocket.current.onerror = (error) => {
      console.error("WebSocket error: ", error);
      setLoading(false); // In case of error, stop loading as well
    };

    // Listen for the custom event to reset video data on new query
    const handleNewQuery = () => {
      setVideoData([]); // Clear the existing video data
      processedLinks.current.clear(); // Clear processed links
      setLoading(true); // Optionally, reset loading state
    };

    window.addEventListener('newQueryReceived', handleNewQuery);
      
      // Listen for the custom event
     window.addEventListener('videoMetadataReceived', function(event) {
      const metadata = event.detail;
      // Execute your code to handle the video metadata here
      console.log('Video Metadata:', metadata);
      // Directly use the metadata object
      if (metadata && metadata.link) {
        // Check if the video link has already been processed
        if (!processedLinks.current.has(metadata.link)) {
            processedLinks.current.add(metadata.link); // Add to the set of processed links
            setVideoData(prevData => [...prevData, metadata]); // Add the new metadata
        } else {
            console.warn('Duplicate video ignored:', metadata);
        }
        setLoading(false);
      } else {
        console.warn('Received metadata is not valid:', metadata);
      }
      
     });


      videoSocket.current.onerror = (error) => {
        console.error("WebSocket error: ", error);
        setLoading(false); // In case of error, stop loading as well
    };

    return () => {
        videoSocket.current.close(); // Cleanup WebSocket on component unmount
        window.removeEventListener('newQueryReceived', handleNewQuery);
    };
  }, []);

  // Handle resizing the chatbot panel by dragging
  const handleMouseDown = () => setIsResizing(true);
  const handleMouseUp = () => setIsResizing(false);
  const handleMouseMove = (e) => {
    if (isResizing) {
      clearTimeout(resizeTimeout.current); // Clear previous timeout
      resizeTimeout.current = setTimeout(() => {
        const newWidth = Math.min(Math.max(2, Math.floor((window.innerWidth - e.clientX) / (window.innerWidth / 12))), 6); // Restrict max width
        setChatWidth(newWidth);
      }, 10); // Throttle the updates
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
      clearTimeout(resizeTimeout.current); // Cleanup on unmount
    };
  }, [isResizing]);

  // Store chat messages in localStorage to preserve them when the chatbot is closed
  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    setMessages(storedMessages);
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);


  // Function to handle the reset button click
  const resetVideos = () => {
    setVideoData([]); // Clear the existing video data
    processedLinks.current.clear(); // Clear processed links
    setLoading(true); // Optionally, reset loading state
  };

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
                <Box key={index} sx={{ width: { xs: '100%', md: '30%' }, maxWidth: '400px' }}>
                  <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', boxShadow: 3, borderRadius: 2 }}>
                  <a href={video.link || '#'} target="_blank" rel="noopener noreferrer">
                    <CardMedia
                      component="img"
                      height="200"
                      image={video.thumbnail_url || 'logo192.png'} // Fallback image
                      alt={video.title}
                      sx={{ objectFit: 'cover' }} // Maintain aspect ratio
                    /></a>
                    <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{video.title || 'No title available'}</Typography>
                      <Typography variant="body2" color="text.secondary">
                      {video.description || 'No description available'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                      Views: {video.views || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Likes:  {video.likes || 'N/A'}
                    </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))
              }
            </Box>
          )}
        </Box>

        {/* Resizable Chatbot Section */}
        {chatOpen && (
          <Box
            sx={{
              width:  `${(chatWidth / 12) * 100}%`, // Adjust the width as needed
              height: '100%', // Full height
              position: 'absolute', // Absolute positioning to overlay
              right: 0, // Align to the right
              top: 0, // Align to the top
              backgroundColor: 'white', // Background color for contrast
              boxShadow: 3, // Optional shadow for depth
              zIndex: 10, // Ensure it's above other elements
              transition: 'width 0.2s ease', // Transition for smooth re-sizing
            }}
          >
            <Chat />

            {/* Drag handle for resizing */}
            <Box
              onMouseDown={handleMouseDown}
              sx={{
                width: '5px', // Width of the resizer
                height: '100%',
                backgroundColor: 'gray',
                cursor: 'ew-resize',
                position: 'absolute',
                left: 0,
                top: 0,
               }}
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
      
      <Button
        variant="contained"
        color="primary"
        onClick={resetVideos}
        sx={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          borderRadius: '50%', // Make the button round
          width: '40px', // Width of the button
          height: '40px', // Height of the button
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: 3,
        }}
      >
        Reset
      </Button>
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