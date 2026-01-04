#!/bin/bash
# Quartz Site Validation Script
# Checks for broken wikilinks and builds the site
# Generates comprehensive logs

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$PROJECT_ROOT/logs"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create logs directory
mkdir -p "$LOG_DIR"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log "Starting site validation..."
log "Project root: $PROJECT_ROOT"
log "Log directory: $LOG_DIR"

# Step 1: Check and fix wikilinks
log "\n=== Step 1: Checking and fixing wikilinks ==="
cd "$PROJECT_ROOT"
python3 "$SCRIPT_DIR/check-and-fix-wikilinks.py"

if [ $? -ne 0 ]; then
    warning "Wikilink check completed with issues (see logs)"
fi

# Step 2: Build the site
log "\n=== Step 2: Building Quartz site ==="
if ! command -v npx &> /dev/null; then
    error "npx not found. Please install Node.js"
    exit 1
fi

BUILD_LOG="$LOG_DIR/build_${TIMESTAMP}.log"
if npx quartz build > "$BUILD_LOG" 2>&1; then
    log "✓ Build successful"
    tail -5 "$BUILD_LOG"
else
    error "Build failed. See $BUILD_LOG for details"
    cat "$BUILD_LOG"
    exit 1
fi

# Step 3: HTTP Testing (optional)
log "\n=== Step 3: Testing HTTP links ==="

# Check if port 8080 is already in use
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1; then
    log "Port 8080 already in use, skipping HTTP tests"
    log "To test HTTP links, run: npx quartz build --serve"
else
    log "Starting local server on port 8080..."
    HTTP_LOG="$LOG_DIR/http_test_${TIMESTAMP}.log"

    # Start server in background
    npx quartz build --serve > "$HTTP_LOG" 2>&1 &
    SERVER_PID=$!

    # Wait for server to start
    sleep 3

    # Check if server started successfully
    if ! kill -0 $SERVER_PID 2>/dev/null; then
        warning "Failed to start local server"
    else
        log "Server started (PID: $SERVER_PID)"

        # Run HTTP tests
        python3 "$SCRIPT_DIR/test-http-links.py" "$HTTP_LOG"
        TEST_RESULT=$?

        # Kill the server
        kill $SERVER_PID 2>/dev/null || true
        wait $SERVER_PID 2>/dev/null || true

        if [ $TEST_RESULT -ne 0 ]; then
            warning "HTTP tests found issues (see $HTTP_LOG)"
        fi
    fi
fi

# Step 4: Summary
log "\n=== Validation Complete ==="
log "Logs saved to: $LOG_DIR"
log "Latest wikilink check: $LOG_DIR/wikilink_check_*.log"
log "Latest build log: $BUILD_LOG"
if [ -f "$HTTP_LOG" ]; then
    log "Latest HTTP test: $HTTP_LOG"
fi

log "\n✓ Site validation completed successfully!"

