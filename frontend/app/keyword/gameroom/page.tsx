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
import { useRef } from 'react';
import LeaveRoomIcon from '@/components/keyword/leaveRoomIcon/LeaveRoomIcon';

const socket = io('https://backend-thrumming-brook-424.fly.dev/');

const GameRoom = ({
  searchParams
}: {
  searchParams: {
    roomCode: string;
  };
}) => {
  const router = useRouter();
  const [users, setUsers] = useState<{ username: string; isHost: boolean; readyStatus: boolean; roundLoaded: boolean }[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const roomCode = searchParams.roomCode;
  const [isHost, setIsHost] = useState<boolean>(false);
  const [readyStatus, setReadyStatus] = useState<boolean>(false);
  const [allReady, setAllReady] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('CELEBRITIES');
  const [selectedCyborg, setSelectedCyborg] = useState<string>('1');
  const [selectedTime, setSelectedTime] = useState<string>('4 min');
  const isNavigatingRef = useRef(false);

  // for leave room to change color icon 
  // const [isHoveredLeave, setIsHoveredLeave] = useState(false);


  const selectedValuesRef = useRef({ selectedCategory, selectedCyborg, selectedTime });

  useEffect(() => {
    selectedValuesRef.current = { selectedCategory, selectedCyborg, selectedTime };
  }, [selectedCategory, selectedCyborg, selectedTime]);

  const handleReady = (roomCode: String, userId: string) => {
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
  };

  const handleCyborgSelect = (value: string) => {
    setSelectedCyborg(value);
  };

  const handleTimeSelect = (value: string) => {
    setSelectedTime(value);
    socket.emit('update-time', roomCode, value);
  };

  // Listen for updates to the room's user list
  const handleUpdateRoom = (usersInRoom: any) => {
    setUsers(usersInRoom);
  };

  const handleGameStart = (category, cyborg, time) => {
    console.log('Navigating with:', {
      roomCode,
      ...selectedValuesRef.current
    });
    isNavigatingRef.current = true;
    router.push(`/keyword/round?roomCode=${roomCode}&category=${category}&cyborg=${cyborg}&time=${time}`);
    // router.push(`/keyword/round?roomCode=${roomCode}`);
  }

  const findNewHost = () => {
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
    const storedReadyStatus = localStorage.getItem('readyStatus') === 'true' ? true : false;
    console.log('storeUserId is ', storedUserId)
    setUsername(storedUsername);
    setUserId(storedUserId);
    setIsHost(isHost);
    setReadyStatus(storedReadyStatus);
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
        socket.emit("check-room-exist", roomCode, (returnValue: any) => {
          if (returnValue.error) {
            // if there is no existing room then create it.
            socket.emit('create-room', username, userId, roomCode);
          } else {
            setUsers(returnValue);
          }
        });
      } else {
        socket.emit("check-room-exist", roomCode, (returnMessage: any) => {
          if (returnMessage.error && !isHost) {
            alert(returnMessage.error);
            window.history.back();
            return;
          } else {
            // TODO: prompt user for username
            console.log("prompt user for username.")
          }
        });
      }

      if (!isHost) {
        socket?.emit('join-room', roomCode, username, userId, (usersInRoom: any) => {
          if (usersInRoom.error) {
            alert(usersInRoom.error);
            return;
          }
          setUsers(usersInRoom);
        });
      }

      socket.on('update-room', handleUpdateRoom);

      socket.on('game-start', (category, cyborg, time) => {
        handleGameStart(category, cyborg, time);
      });

      return () => {
        if (!isNavigatingRef.current) {
          socket.emit('leave-room', roomCode, userId);
        }
        // if (isHost) {
        //   console.log("HELLO");
        //   findNewHost();
        // }
        socket.off('game-start', handleGameStart);
        socket.off('update-room', handleUpdateRoom);
      };
    }
  }, [roomCode, username, userId]);

  const signalAllReady = () => {
    if (allReady) {
      isNavigatingRef.current = true;
      socket.emit('all-ready', roomCode, selectedCategory, selectedCyborg, selectedTime);
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(roomCode).then(() => {
      alert(`Room code copied: ${roomCode}`);
    }).catch((err) => {
      console.error('Failed to copy: ', err);
    });
  };

  const leaveRoom = () => {
    socket.emit('leave-room', roomCode, userId);
    //  removes all local storage items
    localStorage.clear();
    router.push('/keyword');

  }

  return (
    <>
      <div className="backgroundDiv bg-robot bg-cover bg-fixed h-screen bg-center-left-px">
        <div className="gameroomContentContainer text-center w-full max-w-md max-h-screen overflow-auto mx-auto backdrop-blur-sm space-y-6 lg:space-y-4 2xl:space-y-0">
          <LeaveRoomIcon handleClick={leaveRoom} />
          <div className='flex justify-center items-center text-white text-center font-bold'>
            <div className="roomcodeContainer mt-4 mb-4 p-4 border-[3px] border-black rounded-lg bg-[#289773] bg-opacity-70 w-[280px]">
              <div className="flex justify-center items-center space-x-2">
                <h2 className="text-2xl">CODE: {roomCode}</h2>
                <img src="/icons/copyIcon.svg" alt="Copy Icon" className="w-10 h-10 cursor-pointer hover:opacity-60 transition-opacity duration-300" onClick={handleCopy} />
              </div>
            </div>
          </div>
          {isHost && <CategoryDropDown onSelect={handleCategorySelect} />}
          {isHost && <CyborgDropDown onSelect={handleCyborgSelect} />}
          {isHost && <TimeDropDown onSelect={handleTimeSelect} />}
          <PlayerBoard users={users} />
          <RedButton
            onClick={() => { userId && handleReady(roomCode, userId) }}
            label={readyStatus ? 'UNREADY' : 'READY'}
          />
          {isHost && <StartButton label='START GAME' allReady={allReady} onClick={signalAllReady} />}
        </div>
      </div>
    </>
  );
};

export default GameRoom;
