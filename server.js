const { Server } = require('socket.io');

const io = new Server(3001, {
  cors: {
    origin: ['http://localhost:3000', 'https://admin.socket.io'],
    methods: ["GET", "POST"]
  },
});

function generateRoomCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let roomCode = '';
  const charactersLength = characters.length;

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    roomCode += characters[randomIndex];
  }

  return roomCode;
}

let rooms = {};

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);
  console.log('-----------------------');

  socket.on('create-room', (username, uid, callback) => {
    roomCode = String(generateRoomCode());
    if (rooms[roomCode]) {
      // make a new room code
      while (rooms[roomCode]) {
        roomCode = generateRoomCode();
      }
    }

    rooms[roomCode] = {
      host: uid,
      users: [{
        socket: socket.id,
        username: username,
        uid: uid
      }]
    }

    
    socket.join(roomCode);
    console.log(`${username} created room: ${roomCode}`);
    console.log(rooms);
    callback({ roomCode: roomCode });
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
        uid: uid
      });
    } else {
      existingUser.socket = socket.id;
    }

    
    socket.join(roomCode);
    
    console.log(`${username} joined room: ${roomCode}`);

    const usersInRoom = rooms[roomCode].users.map(roomUser => ({
      username: roomUser.username,
      isHost: roomUser.uid === rooms[roomCode].host
    }));

    // update callback function with the list of users
    callback(usersInRoom);

    // alert users that u joined room
    io.to(roomCode).emit('update-room', usersInRoom);
  });

  socket.on('disconnect', () => {
    for (const roomCode in rooms) {
      const userIndex = rooms[roomCode].users.findIndex(user => user.socket === socket.id);
      if (userIndex !== -1) {
        rooms[roomCode].users.splice(userIndex, 1);

        io.to(roomCode).emit('update-room', rooms[roomCode].users.map(roomUser => ({
          username: roomUser.username,
          isHost: roomUser.uid === rooms[roomCode].host
        })));

        // if (rooms[roomCode].users.length === 0) {
        //   delete rooms[roomCode];
        // }

        break;
      }
    }
  });
});

console.log('Socket.io server running on port 3001');

