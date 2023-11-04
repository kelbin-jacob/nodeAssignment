const { body } = require("express-validator");
const ERROR_CODES = require("../utils/errorcodes.util");
const ERROR_MESSAGES = require("../utils/errormessage.util");

const adduser = [
    body("name")
      .notEmpty()
      .withMessage({
        errorCode: ERROR_CODES.NAME_IS_REQUIRED,
        message: ERROR_MESSAGES.NAME_IS_REQUIRED,
      })
      .isString()
      .withMessage({
        errorCode: ERROR_CODES.NAME_MUST_BE_STRING,
        message: ERROR_MESSAGES.NAME_MUST_BE_STRING,
      })
      .trim()

      .isLength({ min: 3, max: 25 })
      .withMessage({
        errorCode: ERROR_CODES.NAME_MUST_BE_LESSTHAN_25,
        message: ERROR_MESSAGES.NAME_MUST_BE_LESSTHAN_25,
      }),
    
    body("age")
      .notEmpty()
      .withMessage({
        errorCode: ERROR_CODES.AGE_IS_REQUIRED,
        message: ERROR_MESSAGES.AGE_IS_REQUIRED,
      })
      .custom((value) => {
        if (parseFloat(value) <= 0) {
          throw new Error('Age must be greater than 0');
        }
        return true;
      })
      .isNumeric()
      .withMessage({
        errorCode: ERROR_CODES.AGE_MUSTBE_NUMERIC,
        message: ERROR_MESSAGES.AGE_MUSTBE_NUMERIC,
      }),
      body("stateId")
      .notEmpty()
      .withMessage({
        errorCode: ERROR_CODES.STATEID_IS_REQUIRED,
        message: ERROR_MESSAGES.STATEID_IS_REQUIRED,
      })
      .isNumeric()
      .withMessage({
        errorCode: ERROR_CODES.STATEID_MUSTBE_NUMERIC,
        message: ERROR_MESSAGES.STATEID_MUSTBE_NUMERIC,
      }),
      
    body("cityId")
    .notEmpty()
    .withMessage({
      errorCode: ERROR_CODES.CITYID_DAYS_IS_REQUIRED,
      message: ERROR_MESSAGES.CITYID_DAYS_IS_REQUIRED,
    })
    .isNumeric()
    .withMessage({
      errorCode: ERROR_CODES.CITYID_MUSTBE_NUMERIC,
      message: ERROR_MESSAGES.CITYID_MUSTBE_NUMERIC,
    }),
  ]

  
const updateUser = [
    body("name")
    .isString()
    .withMessage({
      errorCode: ERROR_CODES.NAME_MUST_BE_STRING,
      message: ERROR_MESSAGES.NAME_MUST_BE_STRING,
    })
    .trim()
    .isLength({ min: 3, max: 25 })
    .withMessage({
      errorCode: ERROR_CODES.NAME_MUST_BE_LESSTHAN_25,
      message: ERROR_MESSAGES.NAME_MUST_BE_LESSTHAN_25,
    }),
    body("age")
    .custom((value) => {
        if (parseFloat(value) <= 0) {
          throw new Error('Age must be greater than 0');
        }
        return true;
      })
      .isNumeric()
      .withMessage({
        errorCode: ERROR_CODES.AGE_MUSTBE_NUMERIC,
        message: ERROR_MESSAGES.AGE_MUSTBE_NUMERIC,
      }),
    
  ]

  const updateManyUser = [
    body("targetAge")
    .notEmpty()
    .withMessage({
      errorCode: ERROR_CODES.TARGETAGE_IS_REQUIRED,
      message: ERROR_MESSAGES.TARGETAGE_IS_REQUIRED,
    })
    .custom((value) => {
        if (parseFloat(value) <= 0) {
          throw new Error('targetAge must be greater than 0');
        }
        return true;
      })
      .isNumeric()
      .withMessage({
        errorCode: ERROR_CODES.AGE_MUSTBE_NUMERIC,
        message: ERROR_MESSAGES.AGE_MUSTBE_NUMERIC,
      }),

      body("newAge")
      .notEmpty()
      .withMessage({
        errorCode: ERROR_CODES.NEWAGE_IS_REQUIRED,
        message: ERROR_MESSAGES.NEWAGE_IS_REQUIRED,
      })
      .custom((value) => {
          if (parseFloat(value) <= 0) {
            throw new Error('newAge must be greater than 0');
          }
          return true;
        })
        .isNumeric()
        .withMessage({
          errorCode: ERROR_CODES.AGE_MUSTBE_NUMERIC,
          message: ERROR_MESSAGES.AGE_MUSTBE_NUMERIC,
        }),
    
  ]


  module.exports = {adduser,updateUser,updateManyUser};
