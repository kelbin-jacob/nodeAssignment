require("dotenv").config();
const bcrypt = require('bcryptjs');
const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const errorCodes = require('../utils/errorcodes.util')
const errorMessages = require('../utils/errormessage.util')


// currentuser interceptor for  Admin
const currentUser  = async (req, res, next) => {
    try {
        // Extract token from the Authorization header
        const token = req.headers['authorization'];
        if (!token) {
            // If token is missing, return unauthorized
            return next(res.status(401).json({
                errorCode: errorCodes.AUTH_HEADER_MISSING,
                message: errorMessages.AUTH_HEADER_MISSING
            }));
        }

        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Find the user in the database based on the decoded token
        const user = await User.findOne({
            where: {
                id: decoded.id,
                status: 1
            }
        });

        // If user not found, return unauthorized
        if (!user) {
            return next(res.status(401).json({
                errorCode: errorCodes.INVALID_TOKEN,
                message: errorMessages.INVALID_TOKEN
            }));
        }

        // Check if the user has the correct role
        if (user.role !== 0) {
            return next(res.status(401).json({
                errorCode: errorCodes.UNAUTHORISED_ACCESS,
                message: errorMessages.UNAUTHORISED_ACCESS
            }));
        }

        // Create an object containing relevant user information
        const currentUserObj = {
            userID: user.id,
            name: user.name,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        
        // Attach the currentUserObj to the request for future use
        req.currentUserObj = currentUserObj;

        // Compare the decoded password with the user's password
        const validPassword = await bcrypt.compare(decoded.password, user.password);

        // If passwords don't match, return unauthorized
        if (!validPassword) {
            return next(res.status(401).json({
                errorCode: errorCodes.INVALID_TOKEN,
                message: errorMessages.INVALID_TOKEN
            }));
        }

        // If all checks pass, proceed to the next middleware
        next();
    } catch (error) {
        // Handle token expiration or other errors
        if (error.name === 'TokenExpiredError') {
            return next(res.status(401).json({
                errorCode: errorCodes.TOKEN_EXPIRED,
                message: errorMessages.TOKEN_EXPIRED
            }));
        }
        return next(res.status(401).json({
            errorCode: errorCodes.UNAUTHORISED_ACCESS,
            message: errorMessages.UNAUTHORISED_ACCESS
        }));
    }
};

// Export the middleware function
module.exports = {currentUser} ;


