'use client';

import RedButton from '@/components/keyword/redButton/RedButton';
import React from 'react';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import CategoryDropDown from '@/components/keyword/categoryDropDown/categoryDropDown';
import CyborgDropDown from '@/components/keyword/cyborgDropDown/cyborgDropDown';
import TimeDropDown from '@/components/keyword/timeDropDown/timeDropDown';
import PlayerBoard from '@/components/keyword/playerBoard/playerBoard';

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
  const userAction = localStorage.getItem('isHost');
  const [selectedCategory, setSelectedCategory] = useState<string>('CELEBRITIES');
  const [selectedCyborg, setSelectedCyborg] = useState<string>('1');
  const [selectedTime, setSelectedTime] = useState<string>('4 min');

  const handleReady = (roomCode: String, userId: string) => {
    socket.emit('update-ready', roomCode, userId, (usersInRoom: any) => {
      setUsers(usersInRoom);
    });
  };

  const handleCategorySelect = (value: string) => {
    setSelectedCategory(value);
    console.log('Selected category:', value);
  };

  const handleCyborgSelect = (value: string) => {
    setSelectedCyborg(value);
    console.log('Selected cyborg:', value);
  };

  const handleTimeSelect = (value: string) => {
    setSelectedTime(value);
    console.log('Selected time:', value);
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
      if (userAction === 'true') {
        socket.emit('create-room', username, userId, roomCode);
      }

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
        socket.emit('leave-room', roomCode, userId);
        socket.off('update-room', handleUpdateRoom);
      };
    }
  }, [roomCode, username, userId]);

  return (
    <>
      <div className="backgroundDiv h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/robotBackground.png)' }}>
        <div className="contentContainer text-center w-[500px] mx-auto">
          <h1>Welcome to the Game Room</h1>
            <p>CODE: {roomCode}</p>
            <CategoryDropDown onSelect={handleCategorySelect}/>
            <CyborgDropDown onSelect={handleCyborgSelect}/>
            <TimeDropDown onSelect={handleTimeSelect}/>
            <p>list of users:</p>
            <ul>
              {users.map((user, index) => (
                <li key={index}>
                  {user.username} {user.isHost && "(Host)"} {!user.readyStatus && "Not"} {"Ready"}
                </li>
              ))}
            </ul>
            <PlayerBoard users={users}/>
            <RedButton onClick={() => {userId && handleReady(roomCode, userId)}} label='READY UP'/>
        </div>
      </div>
    </>
  );
};

export default GameRoom;
