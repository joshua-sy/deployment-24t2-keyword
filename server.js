const { initializeSocketServer } = require('./socketServer');
const http = require('http');

const server = http.createServer();
initializeSocketServer(server);

server.listen(4000, () => {
  console.log('Server is running on port 4000');
});
