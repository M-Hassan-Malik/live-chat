'use client';

import styles from "./page.module.css";
import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

let socket: Socket | undefined; // Specify the type for the socket variable

interface ChatMessage {
  username: string;
  message: string;
}

let joingUser: string = "";

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const [room, setRoom] = useState<string>('');
  const [message, setMessage] = useState<ChatMessage>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    socket = io();

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('message', (msg: ChatMessage) => {
      console.log('Message received:', msg); // Log received messages
      setMessages(prevMessages => [...prevMessages, msg]);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  };

  const sendMessage = () => {
    if (socket && message) {
      socket.emit('message', message); // Send message to the server
      setMessage({
        message: "",
        username: username || ""
      }); // Clear the input field
    }
  };

  if (!username) {
    return (
      <div className={styles.join}>
        <h1>Enter Username</h1>
        <input
          type="text"
          onChange={(e) => { joingUser = e.target.value }}
          placeholder="Username"
        />
        <button onClick={() => { setUsername(joingUser) }}>Join</button>
      </div>
    );
  }

  return (
    <div className={styles.chatRoom}>
      <h1>Chat Room</h1>
      <h6>{`Connected User: ${username.toUpperCase()}`}</h6>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg.message}</div>
        ))}
      </div>
      <input
        type="text"
        value={message?.message}
        onChange={(e) => setMessage({ message: e.target.value, username: username })}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
