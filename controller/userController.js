// controllers/userController.js
const User = require("../models/user.model");
const State = require("../models/state.model");
const City = require("../models/city.model");
const { validationResult } = require("express-validator");
const { Sequelize, Op } = require("sequelize");
const ERROR_CODES = require("../utils/errorcodes.util");
const ERROR_MESSAGES = require("../utils/errormessage.util");
const { Status } = require("../utils/constants.util");
const logger = require("../utils/loggerfile.util");

const createUser = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.errors[0].msg); // Return validation error
    }

    // Check if the requested state exists
    const state = await State.findOne({
      where: { id: req.body.stateId },
    });
    if (!state) {
      return res.status(400).send({
        errorCode: ERROR_CODES.STATE_DOES_NOT_EXIST,
        message: ERROR_MESSAGES.STATE_DOES_NOT_EXIST,
      }); // State doesn't exist; return an error
    }

    // Check if the requested city exists
    const city = await City.findOne({
      where: { id: req.body.cityId, stateId: state.id },
    });
    if (!city) {
      return res.status(400).send({
        errorCode: ERROR_CODES.CITY_DOES_NOT_EXIST,
        message: ERROR_MESSAGES.CITY_DOES_NOT_EXIST,
      }); // City doesn't exist; return an error
    }

    // Extract necessary fields from the request body
    const { name, age, stateId, cityId } = req.body;
    console.log(stateId,"state");

    // Create a new user
    const user = await User.create({
      name,
      age,
      StateId:stateId,
      CityId: cityId,
      status: Status.ACTIVE,
    });
    return res.status(200).send(user); // Return the created user upon success
  } catch (error) {
    logger.error("Error in catch:", error);
    return res.status(500).json({
      errorCode: ERROR_CODES.UNEXPECTED_ERROR,
      message: ERROR_MESSAGES.UNEXPECTED_ERROR,
    }); // Handle unexpected errors and return an error response
  }
};

const updateUser = async (req, res) => {
  try {
     // Check for validation errors
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).send(errors.errors[0].msg); // Return validation error
     }
    // Finding the user by ID from the request parameters
    const user = await User.findOne({ where: { id: req.params.id } });
    console.log(user,"211");

    // If user not found, return an error response
    if (!user) {
      return res.status(404).json({
        errorCode: ERROR_CODES.USER_NOT_FOUND,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
    }

    // Update user properties if new values are provided in the request body
    // If not provided, keep the previous values
    user.age = req.body.age || user.age;
    user.name = req.body.name || user.name;

    // Save the updated user
    await user.save();

    // Return the updated user in the response
    return res.status(200).json(user);
  } catch (error) {
    logger.error("Error in catch:", error);
    // Handling unexpected errors and sending an error response
    return res.status(500).json({
      errorCode: ERROR_CODES.UNEXPECTED_ERROR,
      message: ERROR_MESSAGES.UNEXPECTED_ERROR,
    });
  }
};

const updateManyUsers = async (req, res) => {
  const targetAge = req.body.targetAge; // Target age to search for and update
  const newAge = req.body.newAge; // New age to update

  try {
    // Find all users with the specified age and update their age
    const [affectedRowsCount] = await User.update(
        { age: newAge }, // New values to be updated
        { where: { age: targetAge } } // Condition to filter users by the target age
      );
  
      if (affectedRowsCount > 0) {
        return res.status(200).json({
          message: `Successfully updated the age of ${affectedRowsCount} users to ${newAge}.`,
        });
      } else {
        return res.status(404).json({
            errorCode: ERROR_CODES.USER_NOT_FOUND,
            message: ERROR_MESSAGES.USER_NOT_FOUND,
        });
      }
  } catch (error) {
    logger.error("Error in catch:", error);
    // Error occurred during the update operation
    return res.status(500).json({
      errorCode: ERROR_CODES.UNEXPECTED_ERROR,
      message: ERROR_MESSAGES.UNEXPECTED_ERROR,
    });
  }
};
const hardDeleteUser = async (req, res) => {
  try {
    const userId = req.params.id; // Assuming the user ID to be deleted is obtained from the request parameters

    // Perform the deletion using the destroy method
    const deletedRows = await User.destroy({ where: { id: userId } });

    if (deletedRows > 0) {
      return res.status(200).json({
        message: "User has been deleted successfully.",
      });
    } else {
      return res.status(404).json({
        errorCode: ERROR_CODES.USER_NOT_FOUND,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
    }
  } catch (error) {
    logger.error("Error in catch:", error);
    return res.status(500).json({
      errorCode: ERROR_CODES.UNEXPECTED_ERROR,
      message: ERROR_MESSAGES.UNEXPECTED_ERROR,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; // Assuming the user ID to be marked as deleted is obtained from the request parameters

    // Find the user by ID and update the 'deleted' field
    const [affectedRowsCount] = await User.update(
      { status: Status.DELETED }, // Set the 'deleted' field to true
      { where: { id: userId } }
    );

    if (affectedRowsCount > 0) {
      return res.status(200).json({
        message: "User has been marked as deleted (soft delete).",
      });
    } else {
      return res.status(404).json({
        errorCode: ERROR_CODES.USER_NOT_FOUND,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
    }
  } catch (error) {
    logger.error("Error in catch:", error);
    return res.status(500).json({
      errorCode: ERROR_CODES.UNEXPECTED_ERROR,
      message: ERROR_MESSAGES.UNEXPECTED_ERROR,
    });
  }
};

const findUserByCity = async (req, res) => {
    try {
      const searchTerm = req.query.search || ""; // Get the search term from the query parameters
      const page = req.query.page || 1; // Get the requested page
      const perPage = 10; // Define the number of results per page
  
      const offset = (page - 1) * perPage;
  
      // Find users whose names partially match the search term (case-insensitive) with pagination
      const usersMatchingSearch = await User.findAndCountAll({
        where: {},
        include: [
          {
            model: City,
            where: Sequelize.where(
              Sequelize.fn('LOWER', Sequelize.col('City.name')),
              'LIKE',
              `%${searchTerm.toLowerCase()}%`
            ),
          },
        ],
        limit: perPage,
        offset: offset,
      });
  
      const { count, rows } = usersMatchingSearch;
  
      // Calculate has next
      const totalResults = count;
      const hasNext = totalResults > offset + rows.length;
  
      // Users found - Send successful response with matching users, pagination info, and comments
      return res.status(200).json({
        message: `Users found matching '${searchTerm}'`,
        dataCount: totalResults,
        dataPerPage: rows.length,
        hasNext: hasNext,
        users: rows,
      
      });
    } catch (error) {
        logger.error("Error in catch:", error);
      // Handle unexpected errors - Send a 500 error response
      return res.status(500).json({
        errorCode: ERROR_CODES.UNEXPECTED_ERROR,
        message: ERROR_MESSAGES.UNEXPECTED_ERROR,
      });
    }
  };
const findUserByState = async (req, res) => {
    try {
        const searchTerm = req.query.search || ""; // Get the search term from the query parameters
        const page = req.query.page || 1; // Get the requested page
        const perPage = 10; // Define the number of results per page
    
        const offset = (page - 1) * perPage;
    
        // Find users whose names partially match the search term (case-insensitive) with pagination
        const usersMatchingSearch = await User.findAndCountAll({
          where: {},
          include: [
            {
              model: State,
              where: Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('State.name')),
                'LIKE',
                `%${searchTerm.toLowerCase()}%`
              ),
            },
          ],
          limit: perPage,
          offset: offset,
        });
    
        const { count, rows } = usersMatchingSearch;
    
        // Calculate has next
        const totalResults = count;
        const hasNext = totalResults > offset + rows.length;
    
        // Users found - Send successful response with matching users, pagination info, and comments
        return res.status(200).json({
          message: `Users found matching '${searchTerm}'`,
          dataCount: totalResults,
          dataPerPage: rows.length,
          hasNext: hasNext,
          users: rows,
        
        });
      } catch (error) {
        logger.error("Error in catch:", error);
        // Handle unexpected errors - Send a 500 error response
        return res.status(500).json({
          errorCode: ERROR_CODES.UNEXPECTED_ERROR,
          message: ERROR_MESSAGES.UNEXPECTED_ERROR,
        });
      }
};

module.exports = {
  createUser,
  updateUser,
  updateManyUsers,
  hardDeleteUser,
  deleteUser,
  findUserByCity,
  findUserByState,
};
