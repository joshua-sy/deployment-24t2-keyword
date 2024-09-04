'use client';

import RedButton from '@/components/keyword/redButton/RedButton';
import React from 'react';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import CategoryDropDown from '@/components/keyword/categoryDropDown/categoryDropDown';
import CyborgDropDown from '@/components/keyword/cyborgDropDown/cyborgDropDown';
import TimeDropDown from '@/components/keyword/timeDropDown/timeDropDown';
import StartButton from '@/components/keyword/startButton/startButton';
import PlayerBoard from '@/components/keyword/playerBoard/playerBoard';
import { useRouter } from "next/navigation";

const socket = io('http://localhost:4000');

const GameRoom = ({
  searchParams
}: {
  searchParams: {
    roomCode: String;
  };
}) => {
  const router = useRouter();
  const [users, setUsers] = useState<{ username: string; isHost: boolean; readyStatus: boolean; roundLoaded: boolean}[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const roomCode = searchParams.roomCode;
  const [isHost, setIsHost] = useState<boolean>(false);
  const [allReady, setAllReady] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('CELEBRITIES');
  const [selectedCyborg, setSelectedCyborg] = useState<string>('1');
  const [selectedTime, setSelectedTime] = useState<string>('4 min');
  const [isNavigating, setIsNavigating] = useState(false);


  const handleReady = (roomCode: String, userId: string) => {
    console.log('handle ready function ', roomCode, userId)
    socket.emit('update-ready', roomCode, userId, (usersInRoom: any) => {
      setUsers(usersInRoom);
    });
  };

  const countReady = () => {
    let count = 0;
    users.forEach((user) => {
      if (user.readyStatus) {
        count++;
      }
    });
    return count;
  }

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

  const findNewHost = () => {
    console.log(users);
    for (let user of users) {
      console.log(`${user.username}`);
      if (!user.isHost) {
        console.log(`${user.username} is now the host`);
        user.isHost = true;
        socket.emit("update-room", users);
        break;
      }
    }
  }

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
    if (countReady() === users.length) {
      setAllReady(true);
    } else {
      setAllReady(false);
    }
  }, [users]);

  useEffect(() => {
    if (roomCode && username && userId) {
      if (isHost) {
        socket.emit('create-room', username, userId, roomCode);
      } else {
        socket.emit("check-room-exist", roomCode, (returnMessage: any) => {
          if (returnMessage.error && !isHost) {
            alert(returnMessage.error);
            window.history.back();
            return;
          }
        });
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

      const handleGameStart = () => {
        router.push(`/keyword/round?roomCode=${roomCode}`);
      }
      
      console.log("HEYYAWYDA");
      
      socket.on('game-start', handleGameStart)

      return () => {
        if (!isNavigating) {
          socket.emit('leave-room', roomCode, userId);
          console.log("LEAVING G");
        }
        // if (isHost) {
        //   console.log("HELLO");
        //   findNewHost();
        // }
        socket.off('update-room', handleUpdateRoom);
      };
    }
  }, [roomCode, username, userId]);

  const signalAllReady = () => {
    // router.push(`/keyword/round?roomCode=${roomCode}`);
    if (allReady) {
      setIsNavigating(true);
      socket.emit('all-ready', roomCode, userId);
    }
  }

  return (
    <>
      <div className="backgroundDiv h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/robotBackground.png)' }}>
        <div className="contentContainer text-center w-[500px] mx-auto">
          <h1>Welcome to the Game Room</h1>
            <p>CODE: {roomCode}</p>
            {isHost && <CategoryDropDown onSelect={handleCategorySelect}/>}
            {isHost && <CyborgDropDown onSelect={handleCyborgSelect}/>}
            {isHost && <TimeDropDown onSelect={handleTimeSelect}/>}
            <PlayerBoard users={users}/>
            <RedButton onClick={() => {userId && handleReady(roomCode, userId)}} label='READY UP'/>
            {/*make it so that once all are ready then able to be clicked*/}
            {isHost && <StartButton label='START GAME' allReady={allReady} onClick={signalAllReady} />}
        </div>
      </div>
    </>
  );
};

export default GameRoom;
