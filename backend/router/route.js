const express = require('express');
const router = express.Router();

router.use('/user', require('./userRouter'));

router.use('/object', require('./objectRouter'));

module.exports = router;
