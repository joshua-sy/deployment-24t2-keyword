// hooks/useCheckRoom.ts

import { useState, useEffect } from 'react';

export default function useCheckRoom(roomCode: string) {
  const [roomExists, setRoomExists] = useState(false);

  useEffect(() => {
    async function checkRoom() {
      const response = await fetch(`/api/checkRoomExist?roomCode=${roomCode}`);
      const data = await response.json();
      setRoomExists(data.exists);
    }

    if (roomCode) {
      checkRoom();
    }
  }, [roomCode]);

  return roomExists;
}
