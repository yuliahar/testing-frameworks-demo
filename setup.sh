#!/bin/bash

# Testing Frameworks Demo - Setup Script
# This script sets up the entire testing infrastructure

set -e

echo "🚀 Starting Testing Frameworks Demo Setup..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js installation
echo -e "${BLUE}Checking Node.js installation...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js is not installed. Please install Node.js 23.11.1 or later${NC}"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js $NODE_VERSION found${NC}"
echo ""

# Check npm installation
echo -e "${BLUE}Checking npm installation...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}npm is not installed. Please install npm${NC}"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm $NPM_VERSION found${NC}"
echo ""

# Install main app dependencies
echo -e "${BLUE}Installing main application dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Main app dependencies installed${NC}"
echo ""

# Install Jest test dependencies
echo -e "${BLUE}Installing Jest test dependencies...${NC}"
cd jest-tests
npm install
cd ..
echo -e "${GREEN}✓ Jest test dependencies installed${NC}"
echo ""

# Install Cypress test dependencies
echo -e "${BLUE}Installing Cypress test dependencies...${NC}"
cd cypress-tests
npm install
cd ..
echo -e "${GREEN}✓ Cypress test dependencies installed${NC}"
echo ""


# Create necessary directories
echo -e "${BLUE}Creating necessary directories...${NC}"
mkdir -p jest-tests/reports jest-tests/coverage
mkdir -p cypress-tests/cypress/reports cypress-tests/cypress/videos cypress-tests/cypress/screenshots
echo -e "${GREEN}✓ Directories created${NC}"
echo ""

# Test server startup
echo -e "${BLUE}Testing server startup...${NC}"
npm start &
SERVER_PID=$!
sleep 5

# Check if server is running
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Server started successfully${NC}"
    kill $SERVER_PID
    sleep 2
else
    echo -e "${YELLOW}⚠ Server health check failed${NC}"
    kill $SERVER_PID 2>/dev/null || true
fi
echo ""

# Summary
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨ Setup Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo ""
echo "1. Start the application:"
echo -e "   ${YELLOW}npm start${NC}"
echo ""
echo "2. Run Jest API tests:"
echo -e "   ${YELLOW}npm run test:jest${NC}"
echo ""
echo "3. Run Cypress UI tests (in another terminal):"
echo -e "   ${YELLOW}npm run test:cypress${NC}"
echo "   or"
echo -e "   ${YELLOW}npm run test:cypress:open${NC} (interactive mode)"
echo ""
echo "4. Run all tests:"
echo -e "   ${YELLOW}npm run test:all${NC}"
echo ""
echo "5. View the application:"
echo -e "   ${YELLOW}http://localhost:3000${NC}"
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo "   - Main README: ./README.md"
echo "   - Jest Tests: ./jest-tests/README.md"
echo "   - Cypress Tests: ./cypress-tests/README.md"
echo "   - QA Dashboard: ./qa-dashboard/README.md"
echo ""
echo -e "${GREEN}Happy Testing! 🧪${NC}"
