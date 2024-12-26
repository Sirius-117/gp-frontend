// src/WebSocketContext.js
import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { auth } from './firebase';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [pastChats, setPastChats] = useState([]);  // Added state for pastChats
  const websocket = useRef(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
    } else {
      console.log('No user logged in');
    }
  }, []);

  useEffect(() => {
    websocket.current = new WebSocket('ws://localhost:8000/ws/chat');

    websocket.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    websocket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Message received:', data);

      if (data.type === "past_chats") {
        console.log('Updating past chats:', data.data);
        setPastChats(data.data); // Update pastChats state directly
      }
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

  return (
    <WebSocketContext.Provider value={{ websocket, messages, loading, pastChats }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
