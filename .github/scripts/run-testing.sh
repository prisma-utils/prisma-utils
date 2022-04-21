#!/usr/bin/env bash
set -o errexit -o noclobber -o nounset -o pipefail

RUN_ALL=${1:-"False"}
BASE=${2:-"origin/main"}

echo "Running Unit Testing"

if [[ "$RUN_ALL" == "True" ]]; then
  npx nx affected:test -- --all --parallel --maxParallel=2
else
  AFFECTED=$(node node_modules/.bin/nx affected:libs --plain --base="$BASE")
  echo "Will test: $AFFECTED"
  npx nx affected:test -- --base="$BASE" --parallel --maxParallel=2
fi

echo "Unit Testing Complete"

wait
