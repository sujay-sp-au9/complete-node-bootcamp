const express = require('express');
const viewController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/me', authController.protect, viewController.getAccount);

router.use(authController.isLoggedIn);

router.get('/tour/:tour', viewController.getTour);
router.get('/login', viewController.loginUser);
router.get('/', viewController.getOverview);

module.exports = router;
