// Importing necessary Sequelize modules
const { DataTypes } = require('sequelize');

// Importing the database connection instance from the configuration
const db = require('../dbCofiguration/databaseConnection');

// Defining the User model
const User = db.define('User', {
  // Field for the user's name
  name: {
    type: DataTypes.STRING, // Data type for the name (string)
    allowNull: false,      // Does not allow null values
  },
  // Field for the user's age
  age: {
    type: DataTypes.INTEGER, // Data type for the age (integer)
    allowNull: false,       // Does not allow null values
  },
  // Field for the user's status
  status: {
    type: DataTypes.TINYINT,  // Data type for the status (tiny integer)
    allowNull: false,         // Does not allow null values
    defaultValue: 0,         // Default value set to 0
  },
}, {
  // Other model options can be added here
});

// Exporting the User model for use in other parts of the application
module.exports = User;
