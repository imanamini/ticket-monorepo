#!/bin/sh
set -e  # Exit on error for other commands, we'll handle sentry errors specifically

SENTRY_URL=https://sentry.mydigipay.info
AUTH_TOKEN=58afebf434cc4e66b06883f6f19868294aa10536d2964277b4befc8235121428

# Define a function instead of alias (aliases don't work in sh scripts)
sentry_cli() {
    sentry-cli --url "$SENTRY_URL" --auth-token "$AUTH_TOKEN" "$@"
}
# Get the version (use git describe if not available)
APPNAME=$1

# Set version based on app
# For apps with ngsw-config.json (pillar, dpx), read version from the config file
if [ "$APPNAME" = "pillar" ] || [ "$APPNAME" = "dpx" ]; then
    # Extract version from ngsw-config.json using node
    VERSION=$(node -p "require('./apps/${APPNAME}/ngsw-config.json').appData.version")
    echo "Using version from ngsw-config.json: $VERSION"
else
    # For other apps, use git describe
    VERSION=$(git describe --always --tags)
    echo "Using git version: $VERSION"
fi

# Use the configuration parameter from the Dockerfile
ENVIRONMENT=${configuration:-"development"}

case $APPNAME in
    dpx)
        PROJECT="pwa-w9"
        BUILD_PATH="./dist/apps/app"
        ;;
    pillar)
        PROJECT="fintech-pillar"
        BUILD_PATH="./dist/apps/app"
        ;;
    website)
        PROJECT="website"
        BUILD_PATH="./dist/apps/website"
        ;;
    *)
        PROJECT=""  # Optional default case
        BUILD_PATH="./dist/apps/app"
        ;;
esac

echo "PROJECT is set to: $PROJECT"
echo "ENVIRONMENT is set to: $ENVIRONMENT"
echo "BUILD_PATH is set to: $BUILD_PATH"

# Workflow to create releases and upload source map - with error handling
sentry_cli releases new "$VERSION" --org sentry --project $PROJECT || echo "WARNING: Sentry release creation failed, continuing build"
sentry_cli releases set-commits "$VERSION" --org sentry --project $PROJECT --auto || echo "WARNING: Sentry commit association failed, continuing build"
sentry_cli releases finalize "$VERSION" --org sentry --project $PROJECT || echo "WARNING: Sentry release finalization failed, continuing build"

# Upload source maps with distribution name matching the environment
sentry_cli releases files "$VERSION" upload-sourcemaps --dist "$ENVIRONMENT" --org sentry --project $PROJECT $BUILD_PATH || echo "WARNING: Sentry sourcemap upload failed, continuing build"

# Delete source maps after upload to prevent public access
echo "Deleting source maps from build output..."
find $BUILD_PATH -name "*.map" -type f -delete
echo "Source maps deleted successfully"

# Set environment for the release
sentry_cli releases deploys "$VERSION" new --env "$ENVIRONMENT" --org sentry --project $PROJECT || echo "WARNING: Sentry deploy registration failed, continuing build"

# Exit successfully regardless of Sentry command results
exit 0
