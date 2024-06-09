/*
run-> node app.js
http://localhost:3000
*/
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Chat')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 3000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const Message = require('C://Users//H.MGH//Desktop//chatapp-main-master//models//message.js');
const User = require('C://Users//H.MGH//Desktop//chatapp-main-master//models//user.js');


io.on('connection', async (socket) => {
  console.log('User connected:', socket.id);

  

  try {
    // Fetch previous messages from the database
    const previousMessages = await Message.find().sort({ timestamp: 1 }).populate('info','name').exec();

    // Send previous messages to the newly connected client
    socket.emit('previous messages', previousMessages);
  } catch (error) {
    console.error('Error fetching previous messages:', error);
  }

  // Listen for incoming chat messages
  socket.on('chat message', async (data) => {
    console.log('Received message:', data);
    try {
      // Save the message to MongoDB using async/await
      const message = new Message({info:aval ,user: data.user, text: data.message });
      
      //const message = new Message({ user: userID, text: data.message });  problem when fetching

      await message.save();
      console.log('Message saved to the database');

      // Broadcast the message to all connected clients
      io.emit('chat message', data);
    } catch (error) {
      console.error('Error saving message to database:', error);
    }
  });

  let userID;
  let aval;
  socket.on('user save', async (data) => {

    try {


      const user1 = new User({ name: data.user });
      await user1.save();
       userID=user1._id;
       aval=user1;


      console.log('users save', user1._id);



    } catch (error) {
      console.error('Error saving user to database:', error);
    }
  });
  


  socket.on('clearDocuments', async () => {
    try {
      // Implement the code to clear documents in your MongoDB collection
      await Message.deleteMany({}); // This assumes your model is named 'Message'
      io.emit('messagesCleared');
      console.log('All documents cleared from the database.');
    } catch (error) {
      console.error('Error clearing documents:', error);
    }
  });



  // Listen for user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
app.use(express.static('public'));