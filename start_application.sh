#!/bin/bash

# Get the current directory
PROJECT_DIR=$(pwd)

# Start the frontend
osascript -e "tell application \"Terminal\" to do script \"cd '${PROJECT_DIR}' && npm start\""

# Start the backend
osascript -e "tell application \"Terminal\" to do script \"cd ${PROJECT_DIR}/backend && node database.js\""

echo "Frontend and Backend are starting..."