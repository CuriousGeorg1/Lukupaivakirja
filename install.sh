#!/bin/bash

echo "🚀 Lukupäiväkirja - Pika-asennus"
echo "================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js ei ole asennettu. Asenna Node.js osoitteesta: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js löydetty: $(node --version)"
echo ""

# Install backend dependencies
echo "📦 Asennetaan backend-riippuvuudet..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend-asennuksessa tapahtui virhe"
    exit 1
fi
cd ..
echo "✅ Backend-riippuvuudet asennettu"
echo ""

# Install frontend dependencies
echo "📦 Asennetaan frontend-riippuvuudet..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend-asennuksessa tapahtui virhe"
    exit 1
fi
cd ..
echo "✅ Frontend-riippuvuudet asennettu"
echo ""

echo "✨ Asennus valmis!"
echo ""
echo "Käynnistä sovellus kahdessa eri terminaalissa:"
echo ""
echo "Terminaali 1 (Backend):"
echo "  cd backend"
echo "  npm start"
echo ""
echo "Terminaali 2 (Frontend):"
echo "  cd frontend"
echo "  npm start"
echo ""
echo "Sovellus avautuu automaattisesti osoitteessa http://localhost:3000"
echo ""
