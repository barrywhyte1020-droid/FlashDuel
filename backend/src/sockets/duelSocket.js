// Optional live-duel layer. Async duels (submit-then-compare) work fully
// without this file; this only adds real-time presence + live score pushes
// for two players who are dueling at the same moment.
function registerDuelSocket(io) {
  io.on('connection', (socket) => {
    socket.on('duel:join-room', ({ duelCode, userId, userName }) => {
      socket.join(duelCode);
      socket.to(duelCode).emit('duel:opponent-joined', { userId, userName });
    });

    socket.on('duel:start', ({ duelCode }) => {
      io.to(duelCode).emit('duel:started', { startedAt: Date.now() });
    });

    // Broadcast live progress (card index, running score) as a player answers.
    socket.on('duel:progress', ({ duelCode, userId, cardIndex, runningScore }) => {
      socket.to(duelCode).emit('duel:opponent-progress', { userId, cardIndex, runningScore });
    });

    socket.on('duel:finished', ({ duelCode, userId, finalScore }) => {
      socket.to(duelCode).emit('duel:opponent-finished', { userId, finalScore });
    });

    socket.on('disconnecting', () => {
      for (const room of socket.rooms) {
        if (room !== socket.id) {
          socket.to(room).emit('duel:opponent-left');
        }
      }
    });
  });
}

module.exports = registerDuelSocket;
