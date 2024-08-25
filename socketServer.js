const { read } = require('fs');

let ioInstance;
let rooms = {};

function initializeSocketServer(server) {
  if (ioInstance) return ioInstance;

  const { Server } = require('socket.io');
  ioInstance = new Server(server, {
    cors: {
      origin: ['http://localhost:3000'],
      methods: ["GET", "POST"]
    },
  });

  ioInstance.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    socket.on('create-room', (username, uid, callback) => {
      let roomCode = generateRoomCode();
      while (rooms[roomCode]) {
        roomCode = generateRoomCode();
      }

      rooms[roomCode] = {
        host: uid,
        users: [{ socket: socket.id, username, uid, readyStatus: false }]
      };

      socket.join(roomCode);
      console.log(`${username} created room: ${roomCode}`);
      console.log(rooms);
      callback({ roomCode });
    });

    socket.on('join-room', (roomCode, username, uid, callback) => {
        if (!rooms[roomCode]) {
          // If the room doesn't exist, send an error message to the client
          callback({ error: `Room ${roomCode} does not exist.` });
          return;
        }
    
        // Check if the user already exists in the room
        const existingUser = rooms[roomCode].users.find(room => room.uid === uid);
        if (!existingUser) {
          rooms[roomCode].users.push({
            socket: socket.id,
            username: username,
            uid: uid,
            readyStatus: false
          });
        } else {
          existingUser.socket = socket.id;
        }
    
        socket.join(roomCode);
        
        console.log(`${username} joined room: ${roomCode}`);
    
        const usersInRoom = rooms[roomCode].users.map(roomUser => ({
          username: roomUser.username,
          isHost: roomUser.uid === rooms[roomCode].host,
          readyStatus: roomUser.readyStatus
        }));
    
        // update callback function with the list of users
        callback(usersInRoom);
    
        // alert users that u joined room
        ioInstance.to(roomCode).emit('update-room', usersInRoom);
    });

    socket.on('update-ready', (roomCode, userId) => {
        console.log("hey");
        updateReady(roomCode, userId);
    });

    socket.on('disconnect', () => {
      for (const roomCode in rooms) {
        const userIndex = rooms[roomCode].users.findIndex(user => user.socket === socket.id);
        if (userIndex !== -1) {
          rooms[roomCode].users.splice(userIndex, 1);

          ioInstance.to(roomCode).emit('update-room', rooms[roomCode].users.map(user => ({
            username: user.username,
            isHost: user.uid === rooms[roomCode].host,
            readyStatus: user.readyStatus
          })));

        //   if (rooms[roomCode].users.length === 0) {
        //     delete rooms[roomCode];
        //   }

          break;
        }
      }
    });
  });

  console.log('Socket.IO server initialized');
  return ioInstance;
}

function getRooms() {
    return rooms;
}

function updateReady(roomCode, userId) {
    const user = rooms[roomCode].users.find(user => user.uid === userId);
    user.readyStatus = !user.readyStatus;
    ioInstance.to(roomCode).emit('update-room', rooms[roomCode].users.map(user => ({
        username: user.username,
        isHost: user.uid === rooms[roomCode].host,
        readyStatus: user.readyStatus
    })));
    console.log(rooms.users);
}

function generateRoomCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let roomCode = '';
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    roomCode += characters[randomIndex];
  }
  return roomCode;
}

module.exports = { initializeSocketServer, getRooms };
