const { createLogger, transports, format } = require('winston');
const { combine, timestamp, printf } = format;
const fs = require('fs');
const path = require('path');

// Define log rotation options globally
const logRotationOptions = {
  filename: 'logfile.log',
  level: 'info',
  format: combine(
    timestamp(),
    printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  maxFiles: 5,
  zippedArchive: true,
  frequency: '7d', // Rotate log files every 7 days
};

// Function to configure the logger
function configureLogger() {
  return createLogger({
    transports: [new transports.File(logRotationOptions)],
  });
}

// Function to clear the log file
function clearLogFile(logFilePath) {
  fs.access(logFilePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('Log file does not exist:', err);
    } else {
      fs.truncate(logFilePath, 0, (err) => {
        if (err) {
          console.error('Error clearing log file:', err);
        } else {
          console.log('Log file cleared.');
        }
      });
    }
  });
}

// Create a logger instance
const logger = configureLogger();

// Define the log file path
const logFilePath ="\logfile.log.gz"

// Clear the log file every 7 days
setInterval(() => {
    clearLogFile(logFilePath);
  }, 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
  

module.exports = logger;
