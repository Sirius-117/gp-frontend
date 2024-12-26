import { useEffect, useState } from 'react';
import Layout from './layout';
import { useWebSocket } from './WebSocketContext'; // Use the WebSocket context

const PastChatsPage = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for the custom event when component mounts
  useEffect(() => {
    const handlePastChatsEvent = (event) => {
      // Set the chats when the event is received
      console.log('Received pastChats event with data:', event.detail);  // Check if you’re getting the correct data
      setChats(event.detail);
      setLoading(false);  // Set loading to false when data is received
      console.log('Chats after update:', event.detail);  // Ensure that data is correct
    };

    // Add event listener for the 'pastChats' custom event
    window.addEventListener('pastChats', handlePastChatsEvent);

    // Cleanup event listener when component unmounts
    return () => {
      window.removeEventListener('pastChats', handlePastChatsEvent);
    };
  }, []);
  console.log('Current chats state:', chats);  // Log chats state to see if it has been updated

  // If still loading, show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // If error occurred, display the error
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Layout>
      <div>
        <h1>Past Chats</h1>
        {chats.length > 0 ? (
          <ul>
            {chats.map((chat, index) => (
              <li key={index}>{JSON.stringify(chat)}</li>
            ))}
          </ul>
        ) : (
          <p>No past chats available.</p>
        )}
      </div>
    </Layout>
  );
};

export default PastChatsPage;
