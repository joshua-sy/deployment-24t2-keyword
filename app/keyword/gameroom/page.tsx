'use client';

import RedButton from '@/components/keyword/redButton/RedButton';
import React from 'react';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

const GameRoom = ({
  searchParams
}: {
  searchParams: {
    roomCode: String;
  };
}) => {
  const [users, setUsers] = useState<{ username: string; isHost: boolean; readyStatus: boolean; }[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const roomCode = searchParams.roomCode;

  const handleReady = (roomCode: String, userId: string) => {
    console.log("bruhv");
    socket.emit('update-ready', roomCode, userId, (usersInRoom: any) => {
      setUsers(usersInRoom);
    });
  };

  useEffect(() => {
    // Fetch username and userId from localStorage
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');
    setUsername(storedUsername);
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (roomCode && username && userId) {
      socket?.emit('join-room', roomCode, username, userId, (usersInRoom: any) => {
        if (usersInRoom.error) {
          alert(usersInRoom.error);
          return;
        }
        setUsers(usersInRoom);
      });

      // Listen for updates to the room's user list
      const handleUpdateRoom = (usersInRoom: any) => {
        setUsers(usersInRoom);
      };

      socket.on('update-room', handleUpdateRoom);

      return () => {
        socket.off('update-room', handleUpdateRoom);
      };
    }
  }, [roomCode, username, userId]);

  return (
    <div>
      <h1>Welcome to the Game Room</h1>
      <p>This is the game room page</p>
      <p>Your room code is: {roomCode}</p>
      <p>list of users:</p>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {user.username} {user.isHost && "(Host)"} {!user.readyStatus && "Not"} {"Ready"}
          </li>
        ))}
      </ul>
      <RedButton onClick={() => {userId && handleReady(roomCode, userId)}} label='READY UP'/>
    </div>
  );
};

export default GameRoom;
