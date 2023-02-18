#!/bin/bash

# Go to the database directory
cd database

# The command'll be npm run startDebug
# If the process is already running, kill it
if pgrep -f "npm run startDebug" > /dev/null
then
    echo "Killing the process"
    pkill -f "npm run startDebug"
fi

# Start the process
echo "Starting the process"
npm run startDebug > Server.log &