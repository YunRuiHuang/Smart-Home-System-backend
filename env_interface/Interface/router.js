const express = require('express');
const router = express.Router();

const env = require('./router/env');
router.use('/',env);

module.exports=router;