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

# Function to run a test suite
run_test_suite() {
    local suite_name=$1
    local script_name=$2
    
    log "${YELLOW}========== Running $suite_name Integration Tests ==========${NC}"
    
    if [ ! -f "$script_name" ]; then
        log "${RED}Error: Test script $script_name not found${NC}"
        return 1
    fi
    
    if [ ! -x "$script_name" ]; then
        log "${YELLOW}Warning: Making $script_name executable${NC}"
        chmod +x "$script_name"
    fi

    # Run the test script and capture both exit code and output
    output=$(./$script_name 2>&1)
    exit_code=$?
    
    # Print the output
    echo "$output"
    
    if [ $exit_code -ne 0 ]; then
        log "${RED}❌ $suite_name tests failed${NC}"
        return 1
    else
        log "${GREEN}✅ $suite_name tests passed${NC}"
        return 0
    fi
}

# Clean up any leftover containers before starting
log "Cleaning up any existing test containers..."
docker compose -f compose.api.yaml down --remove-orphans 2>/dev/null || true
docker compose -f compose.ingester.yaml down --remove-orphans 2>/dev/null || true

# Run test suites
run_test_suite "API" "api.sh" || FAILURES=$((FAILURES+1))
run_test_suite "Ingester" "ingester.sh" || FAILURES=$((FAILURES+1))

# Calculate execution time
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

# Print summary
echo
log "${YELLOW}========== Test Summary ==========${NC}"
log "Total execution time: ${DURATION} seconds"

if [ $FAILURES -eq 0 ]; then
    log "${GREEN}🎉 All container integration tests passed successfully!${NC}"
    exit 0
else
    log "${RED}❌ ${FAILURES} test suite(s) failed. Check logs above for details.${NC}"
    exit 1
fi