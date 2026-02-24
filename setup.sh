#!/bin/bash

# AI Interview Simulator Setup Script
# This script helps set up the project for development

echo "=================================="
echo "AI Interview Simulator - Setup"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node --version) is installed${NC}"

# Check if MongoDB is running (optional check)
if command -v mongod &> /dev/null; then
    echo -e "${GREEN}✓ MongoDB is installed${NC}"
else
    echo -e "${YELLOW}⚠ MongoDB not found locally (you can use MongoDB Atlas)${NC}"
fi

echo ""

# Install server dependencies
echo "Installing server dependencies..."
cd Server
if [ ! -f package.json ]; then
    echo -e "${RED}❌ Server/package.json not found${NC}"
    exit 1
fi

npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Server dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install server dependencies${NC}"
    exit 1
fi

# Setup server .env if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "Creating Server/.env from template..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ Server/.env created${NC}"
        echo -e "${YELLOW}⚠ IMPORTANT: Edit Server/.env and add your actual values!${NC}"
    else
        echo -e "${RED}❌ .env.example not found${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Server/.env already exists, skipping...${NC}"
fi

cd ..

echo ""

# Install client dependencies
echo "Installing client dependencies..."
cd Client
if [ ! -f package.json ]; then
    echo -e "${RED}❌ Client/package.json not found${NC}"
    exit 1
fi

npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Client dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install client dependencies${NC}"
    exit 1
fi

# Setup client .env if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "Creating Client/.env..."
    echo "VITE_API_URL=http://localhost:5000/api" > .env
    echo -e "${GREEN}✓ Client/.env created${NC}"
else
    echo -e "${YELLOW}⚠ Client/.env already exists, skipping...${NC}"
fi

cd ..

echo ""
echo "=================================="
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo "=================================="
echo ""
echo -e "${YELLOW}IMPORTANT NEXT STEPS:${NC}"
echo ""
echo "1. 🔐 Edit Server/.env and add your actual values:"
echo "   - Generate strong JWT_SECRET (run: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\")"
echo "   - Add your OpenAI API key"
echo "   - Configure MongoDB URI"
echo ""
echo "2. 🗄️  Make sure MongoDB is running"
echo ""
echo "3. 🚀 Start the application:"
echo "   Terminal 1: cd Server && npm run dev"
echo "   Terminal 2: cd Client && npm run dev"
echo ""
echo "4. 🌐 Open http://localhost:5173 in your browser"
echo ""
echo -e "${RED}⚠️  SECURITY: If you previously committed .env files with API keys,${NC}"
echo -e "${RED}   REVOKE those keys immediately at https://platform.openai.com/api-keys${NC}"
echo ""
echo "For more details, see README.md and SECURITY.md"
echo ""
