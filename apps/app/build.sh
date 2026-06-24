#!/bin/bash

# Build script for UI Experimenter projects
# Generates unique project name and builds to apps/static/

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Path to the project name file
PROJECT_NAME_FILE=".project-name"
STATIC_DIR="../static"

# Function to generate random alphanumeric string
generate_random_name() {
    # Generate 12 character random string (alphanumeric only)
    cat /dev/urandom | LC_ALL=C tr -dc 'a-zA-Z0-9' | fold -w 12 | head -n 1
}

# Function to validate project name (alphanumeric only)
validate_name() {
    if [[ "$1" =~ ^[a-zA-Z0-9]+$ ]]; then
        return 0
    else
        return 1
    fi
}

# Check if this is the first build
if [ -f "$PROJECT_NAME_FILE" ]; then
    # Project already has a name
    PROJECT_NAME=$(cat "$PROJECT_NAME_FILE")
    echo -e "${BLUE}Building project: ${GREEN}$PROJECT_NAME${NC}"
else
    # First build - generate or get project name
    echo -e "${YELLOW}First build detected!${NC}"
    
    # Generate random name
    RANDOM_NAME=$(generate_random_name)
    echo -e "${BLUE}Generated project name: ${GREEN}$RANDOM_NAME${NC}"
    
    # Ask user to accept or provide custom name
    PROJECT_NAME=$RANDOM_NAME
    # echo -e "${YELLOW}Press Enter to accept, or type a custom name (alphanumeric only):${NC}"
    # read -r USER_INPUT
    
    # if [ -z "$USER_INPUT" ]; then
    #     # User accepted the random name
    #     PROJECT_NAME=$RANDOM_NAME
    # else
    #     # Validate user input
    #     if validate_name "$USER_INPUT"; then
    #         PROJECT_NAME=$USER_INPUT
    #     else
    #         echo -e "${RED}Error: Project name must be alphanumeric only!${NC}"
    #         exit 1
    #     fi
    # fi
    
    # Check if project already exists
    if [ -d "$STATIC_DIR/$PROJECT_NAME" ]; then
        echo -e "${RED}Error: A project with name '$PROJECT_NAME' already exists!${NC}"
        echo -e "${YELLOW}Please run the script again to generate a new name.${NC}"
        exit 1
    fi
    
    # Save project name
    echo "$PROJECT_NAME" > "$PROJECT_NAME_FILE"
    echo -e "${GREEN}Project name saved: $PROJECT_NAME${NC}"
fi

# Libraries should already be in src/lib from template creation
# If they're missing, copy them
if [ ! -f "src/lib/device-controls.js" ]; then
    echo -e "${YELLOW}Libraries missing, copying from main libs directory...${NC}"
    mkdir -p src/lib
    cp ../../libs/*.js src/lib/
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
fi

# Build the project
echo -e "${BLUE}Building project...${NC}"
npm run build

# Create static directory if it doesn't exist
mkdir -p "$STATIC_DIR"

# Copy build output to static directory
echo -e "${BLUE}Copying build to $STATIC_DIR/$PROJECT_NAME...${NC}"
rm -rf "$STATIC_DIR/$PROJECT_NAME"
cp -r dist "$STATIC_DIR/$PROJECT_NAME"

# Update paths in the built files to work with subdirectory
# Fix asset paths to be relative
cd "$STATIC_DIR/$PROJECT_NAME"
# Cross-platform sed (works on both macOS and Linux)
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    find . -name "*.html" -exec sed -i'' 's|href="/|href="./|g' {} \;
    find . -name "*.html" -exec sed -i'' 's|src="/|src="./|g' {} \;
    find . -name "*.js" -exec sed -i'' 's|from "/|from "./|g' {} \;
else
    # Linux
    find . -name "*.html" -exec sed -i 's|href="/|href="./|g' {} \;
    find . -name "*.html" -exec sed -i 's|src="/|src="./|g' {} \;
    find . -name "*.js" -exec sed -i 's|from "/|from "./|g' {} \;
fi
cd - > /dev/null

echo -e "${GREEN}Build complete!${NC}"
echo -e "${BLUE}Your project is available at:${NC}"
echo -e "  Local: http://localhost:8080/$PROJECT_NAME/"
echo -e "  Public: {ngrok-url}/$PROJECT_NAME/"
echo -e "\n${YELLOW}Run '../start-hosting.sh' from the apps directory to serve your project${NC}"