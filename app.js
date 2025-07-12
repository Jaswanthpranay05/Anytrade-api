require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const mongoose = require('./config/db'); // Mongo connection
const registerRoute = require('./routes/register');
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


const app = express();
app.use(express.json());

app.use('/api', registerRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
