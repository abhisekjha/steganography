const express = require('express');
const router = express.Router();

router.post('/upload', (req, res) => {
    res.send('File upload endpoint hit');
});

module.exports = router;
