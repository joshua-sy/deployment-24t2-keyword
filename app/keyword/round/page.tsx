'use client';

import RedButton from '@/components/keyword/redButton/RedButton';
import React from 'react';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useRouter } from "next/navigation";
import router from 'next/router';
import PlayerIdentity from '@/components/keyword/playerIdentity/PlayerIdentity';
import { useRef } from 'react';

const socket = io('http://localhost:4000');

const GameRoom = ({
  searchParams
}: {
  searchParams: {
    roomCode: string;
    category: string;
    cyborg: string;
    time: string;
  };
}) => {
  const roomCode = searchParams.roomCode;
  const category = searchParams.category;
  const cyborg = searchParams.cyborg;
  const time = searchParams.time;

  const [users, setUsers] = useState<{
    roundLoaded: boolean; username: string; isHost: boolean; readyStatus: boolean; 
}[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isHost, setIsHost] = useState<boolean>(false);
  const [countdown, setCountdown] = useState(-1);
  const currWord = useRef("NO WORD");

  useEffect(() => {
    // Fetch username and userId from localStorage
    const isHost = localStorage.getItem('isHost') === 'true' ? true : false;
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');
    console.log('storeUserId is ', storedUserId)
    setUsername(storedUsername);
    setUserId(storedUserId);
    setIsHost(isHost);
  }, []);

 

  useEffect(() => {
    if (roomCode && username && userId) {   
      // socket.emit("check-room-exist", roomCode, (returnMessage: any) => {
      //   // If it can't find a room, then room does not exist.
      //   if (returnMessage.error && !isHost) {
      //     alert(returnMessage.error);
      //     // Send them back to the home page
      //     router.push(`/keyword`);
      //     return;
      //   }
      // });

      socket?.emit('player-loaded-round', roomCode, userId, (newCountdown: any) => {
        if (newCountdown.error) {
          alert(newCountdown.error);
          return;
        }
      });

      // If room exist, join the room
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

      socket.on('countdown-update', (newCountdown) => {
        setCountdown(newCountdown);
      });

      if (isHost) {
        socket.emit('get-word', roomCode, category.toLowerCase());
      }

      socket.on('word-generated', (word: string) => {
        console.log('word is ', word);
        word = word.toUpperCase();
        currWord.current = word;
      });

      return () => {
        // console.log("LEAVING GANG");
        console.log(users);
        // if (isHost) {
          //   console.log("HELLO");
          //   findNewHost();
          // }
          socket.off('update-room', handleUpdateRoom);
          socket.off('countdown-update');
          socket.off('word-generated');
          socket.off('player-loaded-round');
          socket.emit('leave-room', roomCode, userId);
        };
    }
  }, [roomCode, username, userId]);

  return (
    <>
      <div className="backgroundDiv h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/robotBackground.png)' }}>
      <PlayerIdentity timer={countdown} identity='SCIENTIST' word={currWord.current} category={category}/>
      </div>
    </>
  );
};

export default GameRoom;
