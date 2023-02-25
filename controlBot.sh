#!/bin/bash

## Ask the user if he wants to stop the bot (Has to be launched previously with npm start (This will start a node main.js))
## Or ask if the user wants to start or restart

echo "What do you want to do?"
echo "1) Start the bot"
echo "2) Stop the bot"
echo "3) Restart the bot"
echo "4) Exit"

read -p "Enter your choice: " choice

case $choice in
    1)
        echo "Starting the bot"
        npm install
        npm start &
        ;;
    2)
        echo "Stopping the bot"
        pkill -f "npm start"
        ;;
    3)
        echo "Restarting the bot"
        pkill -f "npm start"
        npm start &
        ;;
    4)
        echo "Exiting"
        exit
        ;;
    *)
        echo "Invalid choice"
        ;;
esac

# Path: startServer.sh