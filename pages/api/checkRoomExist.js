import { getRooms } from '../../socketServer';

export default function handler(req, res) {
  const { roomCode } = req.query;
  const rooms = getRooms();
  
  if (typeof roomCode !== 'string') {
    return res.status(400).json({ exists: false });
  }

  const roomExists = rooms[roomCode] ? true : false;
  console.log(rooms);
  res.status(200).json({ exists: roomExists });
}
