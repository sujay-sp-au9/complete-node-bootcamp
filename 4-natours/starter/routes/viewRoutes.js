const express = require('express');
const viewController = require('../controllers/viewsController');

const router = express.Router();

router.get('/', viewController.getOverview);
router.get('/tour/:tour', viewController.getTour);
router.get('/login', viewController.loginUser);

module.exports = router;
