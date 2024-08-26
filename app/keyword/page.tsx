'use client';

import React, { useState, useEffect } from 'react';
import GreyButton from '@/components/keyword/greyButton/GreyButton';
import { useRouter } from "next/navigation";
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { v4 as uuidv4 } from 'uuid';
import FormModal from "@/components/keyword/FormModal/FormModal";
import HostRoomModal from "@/components/keyword/HostRoomModal/HostRoomModal";

export default function Home() {
  const router = useRouter();
  const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | undefined>(undefined);
  const [roomCodeToCheck, setRoomCodeToCheck] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  // Trigger room existence check only if roomCodeToCheck is set

  // Generate room code
  function generateRoomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let roomCode = '';
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      roomCode += characters[randomIndex];
    }
    return roomCode;
  }

  const hostGame = (name: string) => {    
    const userId = uuidv4(); // Generate a unique user ID
    // get username from modal
    localStorage.setItem('username', name);
    localStorage.setItem('userId', userId);
    localStorage.setItem('isHost', 'true');

    const newCode = generateRoomCode();

    router.push(`/keyword/gameroom?roomCode=${newCode}`);
  };

  const handleJoin = (roomCode: string, name: string) => {
    setRoomCodeToCheck(roomCode);
    setName(name);
    localStorage.setItem('isHost', "false");
    localStorage.setItem('username', name);
  }

  useEffect(() => {
    if (roomCodeToCheck && name) {
      const userId = uuidv4(); // Generate a unique user ID
      socket?.emit("join-room", roomCodeToCheck, name, userId, (response: any) => {
        if (response.error) {
          alert(response.error);
        } else {
          router.push(`/keyword/gameroom?roomCode=${roomCodeToCheck}`);
        }
      });
    } else if (roomCodeToCheck) {
      console.log("Room does not exist.");
    }
  }, [roomCodeToCheck, name, router]);

  useEffect(() => {
    const newSocket: Socket<DefaultEventsMap, DefaultEventsMap> = io('http://localhost:4000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log(`You connected with socket id: ${newSocket.id}`);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <>
      <div className="backgroundDiv h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/robotBackground.png)' }}>
        {/* Width is fixed to 500 pixels for now */}
        <div className="contentContainer text-center w-[500px] mx-auto">
          <div className="titleContainer py-10">
            <h1 className="welcomeText text-white text-7xl"> WELCOME </h1>
            <h1 className="toText text-white text-7xl"> TO </h1>
            <div className="keywordDiv border-4 border-white rounded-3xl p-8 ">
              <h1 className="keyWordText text-white text-7xl"> KEYWORD </h1>
            </div>
          </div>
          <div>
            <HostRoomModal onSubmit={hostGame} />
            <FormModal onSubmit={handleJoin} />
          </div>
          <div>
            <GreyButton label="HOW TO PLAY"/>
          </div>
        </div>        
      </div>
    </>
  );
}
