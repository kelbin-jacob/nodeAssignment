This Node.js assignment involves performing basic CRUD (Create, Read, Update, Delete) operations using Express.js, MySQL, and Sequelize.

Project Structure
The project includes the following main files and folders:

app.js: Entry point of the application
routes/: Directory containing route definitions
controllers/: Directory containing logic for CRUD operations
models/: Directory for defining Sequelize models
config/: Contains configuration settings
package.json: Contains project metadata and dependencies
.env: File to store environment-specific credentials
Installation
To run the project, follow these steps:

Clone the repository.

Install project dependencies using the following command:

npm install


Set up the environment variables by creating a .env file at the project root with the following content:


//Copy code
DATABASE_NAME=nodeAssignment
HOST=qliv-database.c2nbuwihrcwt.ap-south-1.rds.amazonaws.com
USER_NAME=kelbin
DB_PASSWORD=1234567890
Ensure that you have a MySQL server set up and running.

Start the application by running:

npm start
Usage
The server will start on the specified port (usually port 3000 by default). The CRUD operations can be performed using appropriate API endpoints.

API Endpoints

POST /users/addUser: Create a new user
PUT /users/updateUser/:id: Update a user by ID
PUT /users/updateManyusers: Update many user
DELETE /users/permananentDelete/:id: Permananetly Delete a user by ID
DELETE /users/softDelete/:id: Soft Delete a user by ID
GET /users/getUsersWithCity: Retrieve all users by city
GET /users/getUsersWithState:  Retrieve all users by state


Technologies Used
Node.js
Express.js
MySQL
Sequelize