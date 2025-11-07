#!/bin/bash

# Production Deployment Script for Data Bleed Game
# This script commits and pushes changes to trigger automatic deployments

echo "🚀 Starting production deployment process..."

# Check git status
echo "📋 Current git status:"
git status

echo ""
echo "📦 Adding all changes to git..."
git add .

echo ""
echo "💾 Committing changes..."
git commit -m "Deploy production integration: API config, CORS setup, and monitoring"

echo ""
echo "🌐 Pushing to main branch (triggers auto-deployment)..."
git push origin main

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "🔍 Next steps:"
echo "1. Check Vercel dashboard for frontend deployment status"
echo "2. Check Railway dashboard for backend deployment status"
echo "3. Test production URLs once deployments complete"
echo ""
echo "📊 Production URLs:"
echo "Frontend: https://data-bleed-vsc-game.vercel.app"
echo "Backend:  https://data-bleed-backend.up.railway.app"
echo "Health:   https://data-bleed-backend.up.railway.app/api/health"