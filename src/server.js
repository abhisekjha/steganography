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
app.post('/upload', upload.single('file'), function(req, res) {
    // Handle file upload and potentially perform steganography processing here
    res.send('File processed');
});

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
