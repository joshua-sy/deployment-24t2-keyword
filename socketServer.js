let ioInstance;
let rooms = {};

const generateRandomWord = require('./server');

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

    socket.on('create-room', (username, uid, roomCode) => {
      rooms[roomCode] = {
        host: uid,
        users: [{ socket: socket.id, username, uid, readyStatus: false, roundLoaded: false }],
        gameStart: false,
        timer: 240,
        intervalId: null
      };

      socket.join(roomCode);
      console.log(`${username} created room: ${roomCode}`);
      console.log(rooms);
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
            readyStatus: false,
            roundLoaded: false
          });
        } else {
          existingUser.socket = socket.id;
        }
    
        socket.join(roomCode);
        
        console.log(`${username} joined room: ${roomCode}`);
        console.log('users in room ', roomCode, ' are ', rooms[roomCode].users)
    
        const usersInRoom = userMap(roomCode);

        console.log('users in room ', usersInRoom)
    
        // update callback function with the list of users
        callback(usersInRoom);
    
        // alert users that u joined room
        ioInstance.to(roomCode).emit('update-room', usersInRoom);
    });

    socket.on('update-ready', (roomCode, userId) => {
      console.log('updated ready for userId: ', userId)  
      updateReady(roomCode, userId);
    });

    // socket.on('disconnect', () => {
    //   console.log('disconnect is called')
    //   for (const roomCode in rooms) {
    //     const userIndex = rooms[roomCode].users.findIndex(user => user.socket === socket.id);
    //     if (userIndex !== -1) {
    //         rooms[roomCode].users.splice(userIndex, 1);

    //         ioInstance.to(roomCode).emit('update-room', userMap(roomCode));


    //         if (rooms[roomCode].users.length === 0) {
    //             delete rooms[roomCode];
    //             console.log(`Room ${roomCode} deleted as it is now empty.`);
    //         }

    //         break;
    //     }       
    //   }
    // });

    socket.on('check-room-exist', (roomCode, callback) => {
      if (!rooms[roomCode]) {
        callback({ error: `Room ${roomCode} does not exist.` });
      } else {
        return;
      }
    });

    socket.on('leave-room', (roomCode, userId) => {
      console.log('leave room is called')  
      if (!rooms[roomCode] || !rooms[roomCode].users) {
            return;
        }
        const userIndex = rooms[roomCode].users.findIndex(user => user.uid === userId);
        socket.leave(roomCode);
        console.log(`${userId} left room: ${roomCode}`);
        
        if (userIndex !== -1) {
            rooms[roomCode].users.splice(userIndex, 1);
  
            ioInstance.to(roomCode).emit('update-room', rooms[roomCode].users.map(user => ({
              username: user.username,
              isHost: user.uid === rooms[roomCode].host,
              readyStatus: user.readyStatus
            })));

            // If the room is empty, delete it
            if (rooms[roomCode].users.length === 0) {
                delete rooms[roomCode];
                console.log(`Room ${roomCode} deleted as it is now empty.`);
            }
        }
    });

    socket.on('player-loaded-round', (roomCode, userId) => {
      if (rooms[roomCode]) {
        const user = rooms[roomCode].users.find(user => user.uid === userId);
        user.roundLoaded = true;
        ioInstance.to(roomCode).emit('update-room', userMap(roomCode));

        // loop through users and check if roundLoaded == true
        const allUsersLoaded = rooms[roomCode].users.every(user => user.roundLoaded === true);
        let intervalId = null
        if (allUsersLoaded) {
          intervalId = setInterval(() => {
            if (rooms[roomCode].timer > 0) {
              rooms[roomCode].timer--;
              console.log('timer is now',  rooms[roomCode].timer);
              ioInstance.to(roomCode).emit('countdown-update', rooms[roomCode].timer);
            } else {
              // clear the interval once it reaches 0
              clearInterval(intervalId);
              ioInstance.to(roomCode).emit('countdown-update', rooms[roomCode].timer);
              rooms[roomCode].intervalId = null;
            }
          }, 1000)
        }
        // store the interval ID for the room.
        rooms[roomCode].intervalId = intervalId
        
      }
    });

    // The socket that will take the signal when host clicks start game
    socket.on('all-ready', (roomCode, userId) => {
      // maybe add a check if user is actually host here
      // and if all users are ready

      // but we r gonna be naive for now and just say all are ready
      console.log('roooms in all-ready', rooms[roomCode])
      rooms[roomCode].gameStart = true;
      ioInstance.to(roomCode).emit('game-start');
    });

    socket.on('get-word', (roomCode, categoryName) => {
      // const word = generateRandomWord(categoryName);
      // ioInstance.to(roomCode).emit('word-generated', word);
    });
  });



  console.log('Socket.IO server initialized');
  return ioInstance;
}

function updateReady(roomCode, userId) {
  console.log('users in updateReadyAre for roomCode are : ', rooms[roomCode])
  console.log('rooms data structure ', rooms)
  const user = rooms[roomCode].users.find(user => user.uid === userId);
  user.readyStatus = !user.readyStatus;
  console.log('update ready for userID: ', userId)
  ioInstance.to(roomCode).emit('update-room', userMap(roomCode));
}

const userMap = (roomCode) => {
   return rooms[roomCode].users.map(user => ({
    username: user.username,
    isHost: user.uid === rooms[roomCode].host,
    readyStatus: user.readyStatus,
    roundLoaded: user.roundLoaded
  }));
}

module.exports = { initializeSocketServer };
