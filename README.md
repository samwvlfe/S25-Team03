# Installing Dependencies

After cloning the repo you want to navigate to the directory then input the following:
### `npm i`
This will install most necessary dependencies.
There are currently four additional dependencies you need to install:
### `npm i axios web-vitals express cors`

# Starting Up (Windows Only)

Inside of the folder, you should notice a file titled `start.bat`. Double-click the file.
This will launch both the frontend and the backend.

# Starting Up (Mac/Linux)

Inside of the folder, you should notice a file titled `start_application.sh`.
Open the terminal, navigate to the working directory `chmod 755 start_application.sh`. You only need to do this once.
You should then be able to type the command `./start_application.sh` which will then launch the
frontend and the backend.

# Starting Up (without scripts, Windows/Mac/Linux)

Once everything is installed, you can do the following to get the front end running:
### `npm start`

In order to interact with our databases, you're going to need to open a second terminal. Navigate to the directory of this project, then navigate to the backend folder. Then, run the following command:
### `node database.js`

You can do either of these steps in any order. Refresh the front end if the data has not updated and still says "Loading..."