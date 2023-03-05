#!/bin/bash

set -e

# Check for modified or untracked files after CI has run
diff="$(git diff)"
echo "${diff}"
changed_files="$(git status --porcelain)"
echo "${changed_files}"

# If there is unexpected file changes, reset git repo to HEAD for cleanning up
if [[ -z "${changed_files}" || -z "${diff}" ]]; then
    git reset --hard HEAD
fi
