#!/bin/bash

# Colors and styles for the styled message
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No color

# Screen session name to stop
SCREEN_SESSION="sic"

# Stop Docker Compose services
if docker-compose down; then
    echo -e "${GREEN}Docker Compose services stopped successfully. ${NC}"
else
    echo -e "${RED}Error stopping Docker Compose services. ${NC}"
    exit 1
fi

# Function to stop screen sessions
if screen -XS ${SCREEN_SESSION} quit; then
    echo -e "${GREEN}API Screen shutdown completed. ${NC}"
else
    echo -e "${RED}Error stopping API screen. ${NC}"
    exit 1
fi

# Display a styled end message
echo -e "${YELLOW}-------------------------------------------------${NC}"
echo -e "${YELLOW} Your application is now closed! ${NC}"
echo -e "${YELLOW} See you again ! °u° ${NC}"
echo -e "${YELLOW}-------------------------------------------------${NC}"