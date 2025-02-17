# Installing Dependencies

After cloning the repo you want to navigate to the directory then input the following:
### `npm i`
This will install most necessary dependencies.
There are currently two additional dependencies you need to install:
### `npm i axios web-vitals`

# Starting Up (Windows Only)

Inside of the folder, you should notice a file titled `start.bat`. Double-click the file.
This will launch both the frontend and the backend.

# Starting Up (Mac/Linux)

Once everything is installed, you can do the following to get the front end running:
### `npm start`

In order to interact with our databases, you're going to need to open a second terminal. Navigate to the directory of this project, then navigate to the backend folder. Then, run the following command:
### `node database.js`

You can do either of these steps in any order. Refresh the front end if the data has not updated and still says "Loading..."