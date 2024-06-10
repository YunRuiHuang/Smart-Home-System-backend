const express = require('express');
const router = express.Router();

const bill = require('./router/bill');
router.use('/',bill);

module.exports=router;