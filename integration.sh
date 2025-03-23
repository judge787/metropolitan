#!/bin/bash

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

FAILURES=0
START_TIME=$(date +%s)

# Function to log messages with timestamp
log() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Function to ensure all containers are stopped and removed
cleanup_containers() {
    log "Cleaning up containers and networks..."
    
    # Stop all running containers from our compose files
    docker compose -f compose.api.yaml down --remove-orphans --volumes --timeout 30 2>/dev/null || true
    docker compose -f compose.ingester.yaml down --remove-orphans --volumes --timeout 30 2>/dev/null || true
    
    # Force remove any lingering containers
    if [ "$(docker ps -q)" != "" ]; then
        docker ps -q | xargs docker stop --time 30 2>/dev/null || true
    fi
    
    # Remove orphaned networks
    docker network prune -f >/dev/null 2>&1 || true
    
    # Wait for cleanup to complete
    sleep 15
    
    # Double check no containers are running
    if [ "$(docker ps -q)" != "" ]; then
        log "Warning: Some containers are still running"
        docker ps
        return 1
    fi
    return 0
}

# Function to wait for container health
wait_for_container() {
    local container_name=$1
    local max_attempts=12
    local wait_time=10
    
    log "Waiting for container $container_name..."
    
    for ((i=1; i<=max_attempts; i++)); do
        if docker container inspect "$container_name" >/dev/null 2>&1; then
            if docker inspect --format='{{.State.Health.Status}}' "$container_name" 2>/dev/null | grep -q "healthy"; then
                log "Container $container_name is healthy"
                return 0
            fi
        fi
        log "Attempt $i of $max_attempts: Container not healthy yet"
        sleep $wait_time
    done
    
    log "Container $container_name failed to become healthy"
    return 1
}

# Function to run a test suite
run_test_suite() {
    local suite_name=$1
    local script_name=$2
    
    log "========== Running $suite_name Integration Tests =========="
    
    if [ ! -f "$script_name" ]; then
        log "Error: Test script $script_name not found"
        return 1
    fi
    
    if [ ! -x "$script_name" ]; then
        chmod +x "$script_name"
    fi

    # Ensure clean state
    if ! cleanup_containers; then
        log "Failed to clean up containers, aborting test suite"
        return 1
    fi

    # Run the test script
    log "Starting $suite_name test suite..."
    if ! ./$script_name; then
        log "$suite_name tests failed"
        if [ "$suite_name" = "API" ]; then
            docker compose -f compose.api.yaml logs
        elif [ "$suite_name" = "Ingester" ]; then
            docker compose -f compose.ingester.yaml logs
        fi
        return 1
    fi
    
    log "$suite_name tests passed"
    return 0
}

# Initial cleanup
cleanup_containers

# Run test suites with retries
for suite in "API:api.sh" "Ingester:ingester.sh"; do
    name="${suite%%:*}"
    script="${suite#*:}"
    
    for attempt in {1..2}; do
        log "Attempt $attempt for $name"
        if run_test_suite "$name" "$script"; then
            break
        elif [ $attempt -eq 2 ]; then
            FAILURES=$((FAILURES+1))
        else
            log "Retrying $name test suite..."
            sleep 15  # Increased wait time between retries
        fi
    done
done

# Final cleanup
cleanup_containers

# Calculate execution time
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

# Print summary
echo
log "========== Test Summary =========="
log "Total execution time: ${DURATION} seconds"

if [ $FAILURES -eq 0 ]; then
    log "All tests passed"
    exit 0
else
    log "${FAILURES} test suite(s) failed"
    exit 1
fi
