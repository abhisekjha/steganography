const express = require('express');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const app = express();
const PORT = process.env.PORT || 3000;  // Use a single port variable defined at the top

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Single file upload route
app.post('/upload', upload.fields([{ name: 'plaintext-file', maxCount: 1 }, { name: 'secret-message-file', maxCount: 1 }]), function(req, res) {
    if (!req.files) {
        return res.status(400).send('No files were uploaded.');
    }

    const plaintextFilePath = req.files['plaintext-file'][0].path;
    const secretMessageFilePath = req.files['secret-message-file'][0].path;

    // Call function to process the files for steganography
    performSteganography(plaintextFilePath, secretMessageFilePath);

    res.send('Files processed');
});

function performSteganography(plaintextPath, messagePath) {
    const fs = require('fs');

    let plaintextData = fs.readFileSync(plaintextPath);
    let messageData = fs.readFileSync(messagePath);

    // Example: Simple bitwise operation (this is just a placeholder)
    for (let i = 0; i < messageData.length; i++) {
        plaintextData[i] ^= messageData[i];  // Simple XOR for demonstration
    }

    fs.writeFileSync(plaintextPath, plaintextData);
    console.log('Steganography completed and file saved.');
}


// Import routes
const fileRoutes = require('./routes/files');
app.use('/api/files', fileRoutes);  // Setup API routes

// Start the server on the specified port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is already in use, trying another port...`);
        const newPort = PORT + 1;
        app.listen(newPort, () => {
            console.log(`Server running on port ${newPort}`);
        });
    } else {
        console.log(err);
    }
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Middleware to verify Firebase Token
function checkAuthenticated(req, res, next) {
    let token = req.headers.authorization;
    admin.auth().verifyIdToken(token)
        .then(() => next())
        .catch(() => res.status(403).send('Unauthorized'));
}

app.post('/upload', checkAuthenticated, upload.single('file'), function(req, res) {
    // Handle authenticated file upload
});