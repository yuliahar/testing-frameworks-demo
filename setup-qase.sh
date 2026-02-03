#!/bin/bash

# Qase.io Integration Setup Script

set -e

echo "🎯 Setting up Qase.io Integration..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if main dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing main app dependencies...${NC}"
    npm install
fi

# Install Jest dependencies with Qase reporter
echo -e "${BLUE}Installing Jest dependencies with Qase reporter...${NC}"
cd jest-tests
npm install
cd ..
echo -e "${GREEN}✓ Jest dependencies installed${NC}"
echo ""

# Install Cypress dependencies with Qase reporter
echo -e "${BLUE}Installing Cypress dependencies with Qase reporter...${NC}"
cd cypress-tests
npm install
cd ..
echo -e "${GREEN}✓ Cypress dependencies installed${NC}"
echo ""

# Create .env files if they don't exist
echo -e "${BLUE}Setting up environment files...${NC}"

if [ ! -f "jest-tests/.env" ]; then
    cp jest-tests/.env.example jest-tests/.env
    echo -e "${YELLOW}Created jest-tests/.env - Please fill in your Qase credentials${NC}"
else
    echo -e "${GREEN}✓ jest-tests/.env already exists${NC}"
fi

if [ ! -f "cypress-tests/.env" ]; then
    cp cypress-tests/.env.example cypress-tests/.env
    echo -e "${YELLOW}Created cypress-tests/.env - Please fill in your Qase credentials${NC}"
else
    echo -e "${GREEN}✓ cypress-tests/.env already exists${NC}"
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨ Qase.io Integration Setup Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo ""
echo "1. Sign up for Qase.io (free):"
echo "   ${YELLOW}https://app.qase.io/signup${NC}"
echo ""
echo "2. Create a project and get your API token"
echo ""
echo "3. Update your .env files with credentials:"
echo -e "   ${YELLOW}jest-tests/.env${NC}"
echo -e "   ${YELLOW}cypress-tests/.env${NC}"
echo ""
echo "4. Set these values:"
echo "   QASE_API_TOKEN=your_token_here"
echo "   QASE_PROJECT_CODE=YOUR_CODE"
echo "   QASE_MODE=testops"
echo ""
echo "5. Run tests with Qase reporting:"
echo -e "   ${YELLOW}cd jest-tests && npm run test:qase${NC}"
echo -e "   ${YELLOW}cd cypress-tests && npm run cy:run:qase${NC}"
echo ""
echo "6. For GitHub Actions, add secrets:"
echo "   - QASE_API_TOKEN"
echo "   - QASE_PROJECT_CODE"
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo -e "   - Setup Guide: ${YELLOW}./QASE_SETUP.md${NC}"
echo -e "   - Qase Dashboard: ${YELLOW}./qa-dashboard/README.md${NC}"
echo ""
echo -e "${GREEN}Happy Testing with Qase.io! 🎯${NC}"
