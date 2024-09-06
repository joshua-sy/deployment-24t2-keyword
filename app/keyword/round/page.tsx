'use client';

import RedButton from '@/components/keyword/redButton/RedButton';
import React from 'react';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useRouter } from "next/navigation";
import StartButton from '@/components/keyword/startButton/startButton';
import PlayerBoard from '@/components/keyword/playerBoard/playerBoard';

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
  console.log('roomCode is ', roomCode);
  console.log('category is ', category);
  console.log('cyborg is ', cyborg);
  console.log('time is ', time);

  const [users, setUsers] = useState<{
    roundLoaded: boolean; username: string; isHost: boolean; readyStatus: boolean; 
}[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  // const roomCode = searchParams.roomCode;
  const [isHost, setIsHost] = useState<boolean>(false);
  const [countdown, setCountdown] = useState(-1);



  useEffect(() => {
    // Fetch username and userId from localStorage
    const isHost = localStorage.getItem('isHost') === 'true' ? true : false;
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');
    console.log('storeUserId is ', storedUserId)
    setUsername(storedUsername);
    setUserId(storedUserId);
    setIsHost(isHost);

    socket.emit('get-word', roomCode, category.toLowerCase());

    socket.on('word-generated', (word: string) => {
      console.log('word is ', word);
    });
  }, []);

 

  useEffect(() => {
    if (roomCode && username && userId) {   
      socket?.emit('player-loaded-round', roomCode, userId, (newCountdown: any) => {
        if (newCountdown.error) {
          alert(newCountdown.error);
          return;
        }
      });

      // Listen for updates to the room's user list
      const handleUpdateRoom = (usersInRoom: any) => {
        setUsers(usersInRoom);
      };


      socket.on('update-room', handleUpdateRoom);

      socket.on('countdown-update', (newCountdown) => {
        setCountdown(newCountdown);
      });

      return () => {
        // socket.emit('leave-room', roomCode, userId);
        // console.log("LEAVING GANG");
        console.log(users);
        // if (isHost) {
        //   console.log("HELLO");
        //   findNewHost();
        // }
        socket.off('update-room', handleUpdateRoom);
      };
    }
  }, [roomCode, username, userId]);

  return (
    <>
      <div className="backgroundDiv h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/robotBackground.png)' }}>
        <div className="contentContainer text-center w-[500px] mx-auto">
            <h1>TIME LEFT: {countdown}</h1>
            {/* <ul>
              {users.map((user, index) => (
                <li key={index}>
                  {user.username} {user.isHost && "(Host)"} {!user.roundLoaded && "Not"} {"Ready"}
                </li>
              ))}
            </ul> */}
            <PlayerBoard users={users}/>
        </div>
      </div>
    </>
  );
};

export default GameRoom;
