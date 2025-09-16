let io;
module.exports = {
  init: (socketIo) => { io = socketIo; return io; },
  getIo: () => { if (!io) throw new Error('Socket.io not initialized!'); return io; }
};