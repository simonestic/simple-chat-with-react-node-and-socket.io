const express = require('express');
const router = express.Router();

router.get('/', async (req,res)=>{
    try {
        res.send('server is up and running!');
    } catch (error) {
        res.status(400).send('OOOPS!');
    }
})

module.exports = router;