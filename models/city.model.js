// Import necessary Sequelize modules
const { DataTypes } = require("sequelize");

// Import the database connection instance
const sequelize = require("../dbCofiguration/databaseConnection");

// Import the associated User model
const User = require("../models/user.model");

// Define the City model
const City = sequelize.define("City", {
  // Field for the city's name
  name: {
    type: DataTypes.STRING, // Data type for the name (string)
    allowNull: false, // Does not allow null values
  },
});

// Define associations between City and User models
// A city can have many users
City.hasMany(User);

// A user belongs to a city
User.belongsTo(City);

// Export the City model for use in other parts of the application
module.exports = City;
