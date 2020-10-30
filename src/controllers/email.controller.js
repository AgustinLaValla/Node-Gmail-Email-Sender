const { Router } = require('express');

const router = Router();

router.post('/send-message', (req, res) => {
    const { name } = req.body; 
    const { email } = req.body;
    const { message } = req.body;
    
});