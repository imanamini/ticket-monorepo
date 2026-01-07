#!/bin/bash

# ==========================================
# Script: mr_commit_filter.sh
# Description:
#   - Creates a GitLab merge request from SOURCE_BRANCH to TARGET_BRANCH.
#   - Lists commits between branches whose authors match a given list (case-insensitive).
#   - If no author list is provided, shows all commits.
# ==========================================

SOURCE_BRANCH="$1"
TARGET_BRANCH="$2"
shift 2
AUTHORS=("$@")

REMOTE_URL=$(git remote get-url origin)

if [[ $REMOTE_URL =~ ^https://([^/]+)/(.+)\.git$ ]]; then
  HOST="${BASH_REMATCH[1]}"
  FULL_PATH="${BASH_REMATCH[2]}"
elif [[ $REMOTE_URL =~ ^git@([^:]+):(.+)\.git$ ]]; then
  HOST="${BASH_REMATCH[1]}"
  FULL_PATH="${BASH_REMATCH[2]}"
else
  echo "❌ Could not parse GitLab remote URL: $REMOTE_URL"
  exit 1
fi

# Encode for API usage
ENCODED_PROJECT=$(python3 -c "import urllib.parse; print(urllib.parse.quote('${FULL_PATH}', safe=''))")

echo "🌐 Host: $HOST"
echo "📂 Project path: $FULL_PATH"
echo "🔗 Encoded project: $ENCODED_PROJECT"
GITLAB_TOKEN=$(git config --get gitlab.token)
if [ -z "$GITLAB_TOKEN" ]; then
  echo "❌ Please set your GitLab token via: git config --global gitlab.token <TOKEN>"
  exit 1
fi

API_URL="https://$HOST/api/v4/projects/$ENCODED_PROJECT/merge_requests"

echo "🔧 Creating merge request from '$SOURCE_BRANCH' → '$TARGET_BRANCH'..."
echo "🌐 Using project path: $NAMESPACE/$PROJECT"
echo "🔗 API endpoint: $API_URL"

# --- Create Merge Request ---
MR_RESPONSE=$(curl -s -w "\n%{http_code}" --request POST "$API_URL" \
  --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  --header "Content-Type: application/json" \
  --data "{
    \"source_branch\": \"$SOURCE_BRANCH\",
    \"target_branch\": \"$TARGET_BRANCH\",
    \"title\": \"Merge $SOURCE_BRANCH into $TARGET_BRANCH\"
  }")

HTTP_BODY=$(echo "$MR_RESPONSE" | head -n -1)
HTTP_STATUS=$(echo "$MR_RESPONSE" | tail -n1)

if [[ "$HTTP_STATUS" == "201" ]]; then
  MR_URL=$(echo "$HTTP_BODY" | grep -o '"web_url":"[^"]*' | cut -d'"' -f4)
  echo "✅ Merge Request created: $MR_URL"
elif echo "$HTTP_BODY" | grep -q "Another open merge request already exists"; then
  echo "⚠️ Merge request already exists. Fetching existing one..."
  EXISTING_MR_URL=$(curl -s --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
    "https://$HOST/api/v4/projects/$ENCODED_PROJECT/merge_requests?source_branch=$SOURCE_BRANCH&state=opened" \
    | grep -o '"web_url":"[^"]*' | head -n1 | cut -d'"' -f4)
  echo "🟢 Existing Merge Request: $EXISTING_MR_URL"
else
  echo "❌ Failed to create merge request:"
  echo "$HTTP_BODY"
  exit 1
fi

# --- Show commits between branches ---
echo
echo "📜 Commit list between $TARGET_BRANCH → $SOURCE_BRANCH"
echo "------------------------------------------"

COMMITS=$(git log "$TARGET_BRANCH".."$SOURCE_BRANCH" --pretty=format:'%H|%an|%s')

if [ ${#AUTHORS[@]} -eq 0 ]; then
  echo "$COMMITS" | awk -F'|' '{print $1 ", " $2 ", " $3}'
else
  while IFS='|' read -r COMMIT_ID AUTHOR MESSAGE; do
    for a in "${AUTHORS[@]}"; do
      if [[ "${AUTHOR,,}" == *"${a,,}"* ]]; then
        echo "$COMMIT_ID, $AUTHOR, $MESSAGE"
        break
      fi
    done
  done <<< "$COMMITS"
fi

echo "------------------------------------------"
echo "✅ Done."
