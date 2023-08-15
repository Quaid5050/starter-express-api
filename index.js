const express = require('express');
const { Expo } = require('expo-server-sdk');

const app = express();
const expo = new Expo();

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

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});