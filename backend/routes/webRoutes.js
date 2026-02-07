const express = require('express');
const router = express.Router();
const { home } = require('../controllers/web/homeController');


router.get("/", home);


module.exports = router; 
