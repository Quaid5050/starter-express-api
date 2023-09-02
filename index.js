const express = require('express');
const { Expo } = require('expo-server-sdk');
const { exec } = require('child_process');
const app = express();
const expo = new Expo();
// Parse JSON requests
app.use(bodyParser.json());


// Endpoint to send push notifications
app.post('/send-notification', async (req, res) => {
    const { tokens, title, message } = req.body;

    // Create an array of push notification messages
    const messages = tokens.map(token => ({
        to: token,
        sound: 'default',
        title,
        body: message,
    }));

    try {
        // Send the push notifications
        const chunks = expo.chunkPushNotifications(messages);
        const tickets = [];
        for (const chunk of chunks) {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        }

        res.json({ success: true, tickets });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to send push notifications' });
    }
});




app.get('/send-notification/:token', async (req, res) => {

    const token = req.params.token;
    
    const message = [{
        to: token,
        sound: 'default',
        title: "hello test",
        body: "this is message from quaid ",
    }];

    try {
        // Send the push notifications
        const chunks = expo.chunkPushNotifications(message);
        const tickets = [];
        for (const chunk of chunks) {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        }

        res.json({ success: true, tickets });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to send push notifications' });
    }
});






//Load testing
function executeAutocannon(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve({ stdout, stderr });
        }
      });
    });
  }


// Define a route for running autocannon
app.post('/run-autocannon', async (req, res) => {
     const { url, connections, duration, pipelining } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
  
    const autocannonCommand = `autocannon -c ${connections || 1000} -d ${duration || 20} -p ${pipelining || 10} ${url}`;
  
    try {
      const { stdout, stderr } = await executeAutocannon(autocannonCommand);
      res.json({
        stdout: stdout,
        stderr: stderr,
      });
    } catch (error) {
      res.status(500).json({ error: `Error: ${error.message}` });
    }
});




// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});