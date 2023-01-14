#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

TEST_FILE_PATH="$1"

node solution.js $TEST_FILE_PATH

echo ""
echo "Finished running"
echo ""