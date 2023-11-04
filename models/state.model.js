// Importing necessary Sequelize modules
const { DataTypes } = require('sequelize');

// Importing the database connection instance
const sequelize = require('../dbCofiguration/databaseConnection');

// Importing the associated models
const City = require('../models/city.model');
const User = require('../models/user.model');

// Defining the State model
const State = sequelize.define('State', {
  // Field for the state's name
  name: {
    type: DataTypes.STRING, // Data type for the name (string)
    allowNull: false,      // Does not allow null values
  },
});

// Defining associations between State and other models (City and User)
// A state can have many cities
State.hasMany(City);

// A city belongs to a state
City.belongsTo(State);

// A state can have many users
State.hasMany(User);

// A user belongs to a state
User.belongsTo(State);

// Exporting the State model for use in other parts of the application
module.exports = State;
