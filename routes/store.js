const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store');

router.post('/upload', storeController.upload);
router.get('/store', storeController.getStore);

module.exports = router;
