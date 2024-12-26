import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { useWebSocket } from './WebSocketContext';

const Chat = () => {
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Welcome to the chat! How can I assist you today?' }]);
  const [input, setInput] = useState('');
  const websocket = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const lastChunkRef = useRef(''); // Store the last part of the message

    // Establish WebSocket connection
    useEffect(() => {
        websocket.current = new WebSocket('ws://localhost:8000/ws/chat');
        
        websocket.current.onopen = () => {
          console.log('WebSocket connection established');
        };
    
        websocket.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log('Message received:', data);

         if (data.message_type === 'response_chunk') {
            // setTimeout(() => {
                
            
            // Append chunked response to messages as it streams in
            setMessages((prevMessages) => {
              const updatedMessages = [...prevMessages];
              const lastMessage = updatedMessages[updatedMessages.length - 1];
              
              if (lastMessage && lastMessage.sender === 'bot') {

                const currentChunk = data.message;
                // const lastChunk = lastChunkRef.current;
    
                // Avoid appending duplicate content by checking overlap with last chunk
                const trimmedChunk = currentChunk.startsWith(lastMessage.text)
                  ? currentChunk.slice(lastMessage.text.length)
                  : currentChunk;
    
                lastMessage.text += trimmedChunk;
                lastChunkRef.current = currentChunk; // Update the last chunk reference
    
                } else {
                // Otherwise, add a new message for the bot
                updatedMessages.push({ sender: 'bot', text: data.message });
                lastChunkRef.current = data.message; // Initialize last chunk reference
              }
              return updatedMessages;
            });
        // }, 10);
        } else if (data.message_type === 'first_chunk') {
            // Start new bot message for first chunk
            setMessages((prevMessages) => [
              ...prevMessages,
              { sender: 'bot', text: data.message }
            ]);
            lastChunkRef.current = data.message; // Set the first chunk as reference
          } else if (data.message_type === 'last_chunk') {
            // Stop streaming after the last chunk is received
            setIsStreaming(false);
            lastChunkRef.current = ''; // Reset the chunk reference
          } else if (data.message_type === 'error') {
            console.error(data.message || "An unknown error occurred");
          }
          else if (data.message_type === "video_metadata") {
          const event = new CustomEvent('videoMetadataReceived', { detail: data.metadata });
          window.dispatchEvent(event);
          }
          else if (data.message_type === "reset_videos") {
            // Dispatch the newQueryReceived event (this resets the video cards with every new query)
            const event = new Event('newQueryReceived');
            window.dispatchEvent(event);
          }
         else if (data.message_type === "notification") {
        // Display the notification to the user
        displayNotification(data.message);}

        // else if (data.type === "past_chats") {
        //   console.log('Dispatching pastChats event with data:', data.data); // Check if the data is correct
        //   const pastChatsEvent = new CustomEvent('pastChats', { detail: data.data });
        //   window.dispatchEvent(pastChatsEvent);} // Broadcast the event

        };
    
        websocket.current.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
    
        websocket.current.onclose = () => {
          console.log('WebSocket connection closed');
        };
    
        // Cleanup WebSocket on component unmount
        return () => {
          websocket.current.close();
        };
      }, []);

  function displayNotification(message) {
    const chatBox = document.getElementById("chat-box");
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    chatBox.appendChild(notification);
}

  // Function to handle message sending
  const handleSendMessage =  () => {
    if (input.trim() === '') return;

    // // Dispatch the newQueryReceived event (this resets the video cards with every new query)
    // const event = new Event('newQueryReceived');
    // window.dispatchEvent(event);

    // Add user message to the messages array
    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    // Send message through WebSocket
    websocket.current.send(input);
    // Clear the input field
    setInput('');
    setIsStreaming(true);  // Start streaming for the bot's response

  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
    //   event.preventDefault(); // Prevent the default Enter key behavior (e.g., form submission)
      handleSendMessage();
    }
  };


  // Auto-scroll to the bottom of the chat when messages update
  useEffect(() => {
    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [messages]);


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '20px', backgroundColor: '#121212' }}>
      <Box id="chat-box" sx={{ flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: '#222', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
        '::-webkit-scrollbar': {
      width: '17px',
     },
     '::-webkit-scrollbar-track': {
      background: '#222',
     },
     '::-webkit-scrollbar-thumb': {
      backgroundColor: '#444',
      borderRadius: '6px',
      border: '3px solid #222',
     },
     '::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '#666',
     }, }}>
        {messages.map((msg, index) => (
          <Box
          key={index}
          sx={{
            display: 'flex',
            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '10px',
            alignItems: "center"
          }}
        >
          {msg.sender !== 'user' && (
          <Box component="img" src="logo192.png" alt="Bot Logo" sx={{ width: '40px', height: '40px', marginRight: '10px', borderRadius: '50%' }} />
          )}
          <Card
            sx={{
              maxWidth: '70%',
              backgroundColor: msg.sender === 'user' ? '#333' : '#424242',
              color: 'white',
              borderRadius: '8px',
              padding: '10px',
              textAlign: msg.sender === 'user' ? 'right' : 'left', // Ensure text is aligned within the card
              boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
            }}
          >
            <CardContent>
              <Typography variant="body1">
                {msg.text}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        ))}
        {/* Display loading animation while waiting for the bot to respond */}
        {isStreaming && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '10px' }}>
            <CircularProgress size={30} sx={{ marginRight: '10px' }} />
            <Typography variant="body1" sx={{ color: 'gray' }}>
              ...
            </Typography>
          </Box>
        )}
      </Box>
      <Box sx={{ display: 'flex', marginTop: '20px', alignItems: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#333',      // Dark gray background
              color: 'white',               // White text color
              '& fieldset': {
                borderColor: '#666',        // Optional: gray border color
              },
              '&:hover fieldset': {
                borderColor: '#888',        // Optional: lighter gray on hover
              },
              '&.Mui-focused fieldset': {
                borderColor: '#90caf9',     // Optional: blue border when focused
              },
            },
            '& .MuiInputLabel-root': {
              color: '#aaa',               // White placeholder text
            },
          }}
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage} sx={{ marginLeft: '10px', borderRadius: '20px', padding: '10px 20px', backgroundColor: '#007bff',
            color: 'white', boxShadow: '0 2px 6px rgba(0,0,0,0.4)' }} disabled={isStreaming}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Chat;