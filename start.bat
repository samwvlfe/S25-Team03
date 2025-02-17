@echo off

:: Starting the front end.
start powershell -Command "npm start"

:: Navigating and starting the backend.
start powershell -Command "cd backend; node database.js"