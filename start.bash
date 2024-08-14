#!/bin/bash

# Colors and styles for the styled message
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No color

# Check if screen is installed
if ! command -v screen &> /dev/null; then
    echo -e "${RED}screen is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed. Please install it first.${NC}"
    exit 1
fi

# Get the current WSL2 IP address
WSL_IP=$(hostname -I | awk '{print $1}')

if docker-compose up -d; then
    echo -e "${GREEN}Docker Compose started successfully.${NC}"

    cd server/
    # Try to start the screen session and check the output
    if screen -dmS sic; then
        echo -e "${GREEN}Screen session created.${NC}"
        if screen -S sic -X stuff "npm start $(echo -ne '\015')"; then
            echo -e "${GREEN}Screen session started with npm start.${NC}"
        else
            echo -e "${RED}Error starting screen session.${NC}"
            exit 1 # Stop script on error
        fi
    else
        echo -e "${RED}Error creating screen session.${NC}"
        exit 1 # Stop script on error
    fi
else
    echo -e "${RED}Error starting Docker Compose.${NC}"
    exit 1 # Stop script on error
fi

# Display a styled end message
echo -e "${YELLOW}-------------------------------------------------${NC}"
echo -e "${YELLOW} Your application is now running! ${NC}"
echo -e "${YELLOW} You can access the application at: ${NC}"
echo -e "${GREEN} http://$WSL_IP ${NC}"
echo -e "${YELLOW}-------------------------------------------------${NC}"