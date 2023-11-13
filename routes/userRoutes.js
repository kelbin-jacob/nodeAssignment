const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const currentUser=require('../middlewares/userAuthentication.middlewares')

const validator=require('../utils/expressvalidator.util')

// Route to create a new user
router.post('/addUser',currentUser.currentUser,validator.adduser, userController.createUser);

// Route to login a new user
router.post('/login', userController.login);

// Route to update token
router.post('/tokenUpdate', userController.tokenRefresh);

// Route to update a single user by ID
router.put('/updateUser/:id',validator.updateUser, userController.updateUser);

// Route to update multiple users
router.put('/updateManyUser',validator.updateManyUser, userController.updateManyUsers);

// Route to perform a permanent delete of a user by ID
router.delete('/permananentDelete/:id', userController.hardDeleteUser);

// Route to perform a soft delete of a user by ID
router.delete('/softDelete/:id', userController.deleteUser);

// Route to get users by city
router.get('/getUsersWithCity', userController.findUserByCity);

// Route to get users by state
router.get('/getUsersWithState', userController.findUserByState);

module.exports = router;
