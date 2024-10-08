'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useRouter } from "next/navigation";
import PlayerIdentity from '@/components/keyword/playerIdentity/PlayerIdentity';
import RoundOver from '@/components/keyword/roundOver/RoundOver';
import { useRef } from 'react';
import LoadingModal from '@/components/keyword/LoadingModal/LoadingModal';

const socket = io('https://backend-thrumming-brook-424.fly.dev/');

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
  const numCyborgs = searchParams.cyborg;
  const time = searchParams.time;

  const [users, setUsers] = useState<{
    roundLoaded: boolean; username: string; isHost: boolean; readyStatus: boolean;
  }[]>([]);
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isHost, setIsHost] = useState<boolean>(false);
  const [countdown, setCountdown] = useState('');
  const currWord = useRef("NO WORD");
  const currIdentity = useRef("No Identity");
  const [isRoundOver, setIsRoundOver] = useState(false);
  const isNavigatingRef = useRef(false);

  const returnToLobby = () => {
    isNavigatingRef.current = true;
    router.push('/keyword/gameroom?roomCode=' + roomCode);
  };

  const exitRoom = () => {
    router.push('/keyword');
  };

  useEffect(() => {
    // Fetch username and userId from localStorage
    const isHost = localStorage.getItem('isHost') === 'true' ? true : false;
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');
    setUsername(storedUsername);
    setUserId(storedUserId);
    setIsHost(isHost);
  }, []);

  function str_pad_left(string: string, pad: string, length: number) {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  }

  useEffect(() => {
    if (roomCode && username && userId) {
      socket.emit("check-room-exist", roomCode, (returnMessage: any) => {
        // If it can't find a room, then room does not exist.
        if (returnMessage.error) {
          alert(returnMessage.error);
          // Send them back to the home page
          router.push(`/keyword`);
          return;
        }
      });

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
        const minutes = Math.floor(newCountdown / 60);
        const seconds = newCountdown - minutes * 60;
        const formattedTime = str_pad_left(minutes.toString(), '0', 2) + ':' + str_pad_left(seconds.toString(), '0', 2);
        setCountdown(formattedTime);
      });

      socket.emit('get-word', roomCode, category.toLowerCase());
      socket.emit('generate-identity', roomCode, numCyborgs);

      socket.on('word-generated', (word: string) => {
        console.log('word is ', word);
        word = word.toUpperCase();
        currWord.current = word;
      });

      socket.on('identity-generated', (identity: string) => {
        // HAVE A LOADING PAGE UNTIL THIS IS CALLED
        identity = identity.toUpperCase();
        currIdentity.current = identity;
      });

      socket.on('game-end', () => {
        setIsRoundOver(true);
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
        if (!isNavigatingRef.current) {
          socket.emit('leave-room', roomCode, userId);
        }
      };
    }
  }, [roomCode, username, userId]);

  return (
    <>
      <div className="backgroundDiv h-screen bg-cover bg-fixed bg-center-left-px" style={{ backgroundImage: 'url(/robotBackground.png)' }}>
        {/* Add currWord.current === 'No WORD' once bug fixed */}
        {currIdentity.current === 'No Identity' || countdown === '' || currWord.current === 'NO WORD' ? <LoadingModal /> : null}
        <PlayerIdentity timer={countdown} identity={currIdentity.current} word={currWord.current} category={category} isHost={isHost} roomCode={roomCode} socket={socket} />
        {isRoundOver && <RoundOver onReturnToLobby={returnToLobby} onExitRoom={exitRoom} />}
      </div>
    </>
  );
};

export default GameRoom;
