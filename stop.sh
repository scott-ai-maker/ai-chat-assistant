#!/bin/bash

# Stop and remove Docker containers
echo "Stopping Docker containers..."
docker-compose down

echo "✅ Containers stopped and removed"
echo ""
echo "To clean up images as well, run:"
echo "docker-compose down --rmi all"
