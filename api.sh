#!/bin/bash

set -e

echo "Building and starting test containers..."
docker compose -f compose.api.yaml build
docker compose -f compose.api.yaml up -d

echo "Waiting for services to be ready..."
timeout=30
while ! curl -s http://localhost:8081/actuator/health | grep -q "UP"
do
  if [ "$timeout" -le 0 ]; then
    echo "Backend service failed to start within the allocated time"
    docker compose -f compose.api.yaml logs test-backend
    docker compose -f compose.api.yaml down
    exit 1
  fi
  timeout=$((timeout-1))
  echo "Waiting for backend... ($timeout seconds remaining)"
  sleep 1
done

echo "Running frontend integration tests..."
docker compose -f compose.api.yaml exec -T test-frontend npm run test:integration

# Capture exit code
EXIT_CODE=$?

# Clean up
echo "Cleaning up containers..."
docker compose -f compose.api.yaml down

exit $EXIT_CODE