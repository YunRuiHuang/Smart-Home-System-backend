const express = require('express');
const router = express.Router();

const basic = require('./router/music');
router.use('/',basic);


module.exports=router;