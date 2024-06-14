const express = require('express');
const router = express.Router();

const items = require('./router/items');
router.use('/',items);


module.exports=router;