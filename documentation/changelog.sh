#!/bin/bash

set -e

CHANGELOG_FILE="documentation/docs/CHANGELOG.md"
TEMP_LOG="temp_changelog.md"

# Initialize CHANGELOG if it does not exist
if [ ! -f "$CHANGELOG_FILE" ]; then
  echo -e "# Changelog\n\nAll notable changes to this project will be documented in this file.\n\nThe format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).\n" > "$CHANGELOG_FILE"
fi

# Get all tags
git fetch --tags

# Determine current and previous tags
LATEST_TAG="${CI_COMMIT_TAG:-$(git tag --sort=-creatordate | head -n 1)}"
PREVIOUS_TAG=$(git tag --sort=-creatordate | grep -v "$LATEST_TAG" | head -n 1)

# Exit if tag is already present
if grep -q "\[$LATEST_TAG\]" "$CHANGELOG_FILE"; then
  echo "❌ Changelog for $LATEST_TAG already exists. Skipping update."
  exit 0
fi

echo "✅ LATEST_TAG: $LATEST_TAG"

# Get release date from tag
RELEASE_DATE=$(git log -1 --format=%aI "$LATEST_TAG" | cut -d'T' -f1)

# Get commit history between the two tags
COMMITS=$(git log "$PREVIOUS_TAG".."$LATEST_TAG" --no-merges --pretty=format:"%s by @%an in %h")

# Categorize changes
ADDED=""
CHANGED=""
FIXED=""
REMOVED=""
SECURITY=""

while IFS= read -r line; do
  case "$line" in
    *feat*|*implement*) ADDED+="- ${line}\n" ;;
    *fix*|*bug*|*resolve*|*patch*) FIXED+="- ${line}\n" ;;
    *update*|*modify*|*change*|*refactor*|*chore*) CHANGED+="- ${line}\n" ;;
    *decommission*|*delete*|*remove*) REMOVED+="- ${line}\n" ;;
    *security*|*vuln*|*"patch security"*) SECURITY+="- ${line}\n" ;;
    *) CHANGED+="- ${line}\n" ;;
  esac
done <<< "$COMMITS"

# Format the changelog entry
{
  echo -e "## [$LATEST_TAG] - $RELEASE_DATE\n"
  [[ -n "$ADDED" ]] && echo -e "### Added\n$ADDED"
  [[ -n "$CHANGED" ]] && echo -e "### Changed\n$CHANGED"
  [[ -n "$FIXED" ]] && echo -e "### Fixed\n$FIXED"
  [[ -n "$REMOVED" ]] && echo -e "### Removed\n$REMOVED"
  [[ -n "$SECURITY" ]] && echo -e "### Security\n$SECURITY"
  echo ""
} > "$TEMP_LOG"

# Insert below intro section (before first ## tag)
LINE_NUMBER=$(grep -n "^## \[" "$CHANGELOG_FILE" | head -n 1 | cut -d: -f1)

if [ -z "$LINE_NUMBER" ]; then
  cat "$TEMP_LOG" >> "$CHANGELOG_FILE"
else
  head -n $((LINE_NUMBER - 1)) "$CHANGELOG_FILE" > temp_header.md
  tail -n +$((LINE_NUMBER)) "$CHANGELOG_FILE" > temp_old_entries.md
  cat temp_header.md "$TEMP_LOG" temp_old_entries.md > "$CHANGELOG_FILE"
  rm temp_header.md temp_old_entries.md
fi

rm "$TEMP_LOG"

git add "$CHANGELOG_FILE"
git commit -m "📜 Update CHANGELOG.md for $LATEST_TAG"

echo "✅ CHANGELOG.md updated successfully!"
