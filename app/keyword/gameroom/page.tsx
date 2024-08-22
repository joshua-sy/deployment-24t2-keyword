'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

const GameRoom = ({
  searchParams
}: {
  searchParams: {
    roomCode: String;
  };
}) => {
  const [users, setUsers] = useState<{ username: string; isHost: boolean }[]>([]);
  const roomCode = searchParams.roomCode;

  useEffect(() => {
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    if (roomCode) {
      socket?.emit('join-room', roomCode, username, userId, (usersInRoom: any) => {
        if (usersInRoom.error) {
          console.error(usersInRoom.error);
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
  }, [roomCode]);

  return (
    <div>
      <h1>Welcome to the Game Room</h1>
      <p>This is the game room page</p>
      <p>Your room code is: {roomCode}</p>
      <p>list of users:</p>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {user.username} {user.isHost && "(Host)"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameRoom;
