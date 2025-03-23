#!/bin/bash

set -e

echo "Building and starting data pipeline test containers..."
docker compose -f compose.ingester.yaml up -d

echo "Waiting for database to be ready..."
timeout=30
until docker compose -f compose.ingester.yaml exec -T test-db mysqladmin ping -h"localhost" -u"root" -p"pwd" --silent
do
  if [ "$timeout" -le 0 ]; then
    echo "Database failed to start within the allocated time"
    docker compose -f compose.ingester.yaml logs test-db
    docker compose -f compose.ingester.yaml down
    exit 1
  fi
  timeout=$((timeout-1))
  echo "Waiting for database... ($timeout seconds remaining)"
  sleep 1
done

# Show environment variables for debugging
echo "Environment variables in test-ingester:"
docker compose -f compose.ingester.yaml exec test-ingester env | grep DB_

echo "Running ingester integration tests..."
docker compose -f compose.ingester.yaml exec test-ingester python -m pytest tests/integration/test_DatabaseIngration.py -v

# Capture exit code
EXIT_CODE=$?

# Clean up
echo "Cleaning up containers..."
docker compose -f compose.ingester.yaml down

exit $EXIT_CODE