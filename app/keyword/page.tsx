'use client';

import Image from "next/image";
import React, { useState, useEffect } from 'react';
import RedButton from '@/components/keyword/redButton/RedButton';
import GreyButton from '@/components/keyword/greyButton/GreyButton';
import { useRouter } from "next/navigation";
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { v4 as uuidv4 } from 'uuid';


export default function Home() {
  const router = useRouter();
  const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | undefined>(undefined);


  const goToGameRoom = () => {    
    // get username from modal
    const username = "kj";
    localStorage.setItem('username', username);

    const userId = uuidv4(); // Generate a unique user ID
    localStorage.setItem('userId', userId);

    socket?.emit('create-room', username, userId, (newCode: any) => {
      router.push(`/keyword/gameroom?roomCode=${newCode.roomCode}`);
    });
  };

  useEffect(() => {
    const newSocket: Socket<DefaultEventsMap, DefaultEventsMap> = io('http://localhost:3001');
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
            <RedButton onClick={goToGameRoom} label={"HOST ROOM"}/>
            <RedButton label={"JOIN ROOM"}/>
          </div>
          <div>
            <GreyButton label="HOW TO PLAY"/>
          </div>
        </div>
       
        
      </div>
    </>
  );
}
