#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

tsc solution.ts --esModuleInterop

echo ""
echo "Finished building"
echo ""