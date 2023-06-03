#!/bin/sh
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"
#check if config.json exists
if [ ! -f config/$CURRENT_BRANCH.json ]; then
    echo "ERROR: config.json not found for branch $CURRENT_BRANCH!"
    exit 1
fi

echo "Setting workspace..."
if [ ! -d .stack ]; then
    mkdir .stack
fi

rm -rf .stack/*
cp config/$CURRENT_BRANCH.json .stack/config.json

echo "Inject config.json..."

INIT_VARIABLES=$(python3 scripts/python/inject_values.py)
echo $INIT_VARIABLES

cd .stack/

echo "Init variables..."

ENVIRONMENT_ID=$(jq -r '.parameters."EnvironmentId"' config.json)
NODE_VERSION=$(jq -r '.pipeline.project."node-version"' config.json)

echo "EnvironmentId: $ENVIRONMENT_ID"
echo "Node version: $NODE_VERSION"

cd ../

echo "Checkout nodejs version..."

# check if that version is installed
if [ ! -d ~/.nvm/versions/node/$NODE_VERSION ]; then
    echo "ERROR: Node version $NODE_VERSION not found!"
    exit 1
fi
nvm --version
nvm use $NODE_VERSION
node --version

rm -rf dist/
rm -rf layer/

echo "Install dependencies..."

# check if package.json exists
if [ ! -f package.json ]; then
    echo "ERROR: package.json not found!"
    exit 1
fi

#check if node_modules exists
if [ ! -d node_modules ]; then
    echo "Node modules not found!, installing..."
    npm install
fi

#check if npm run build is executed successfully
echo "[EXEC] npm run build"
npm run build

if [ $? -ne 0 ]; then
    echo "ERROR: npm run build failed!"
    exit 1
fi

mkdir -p layer/nodejs/ && cp package.json layer/nodejs/
cd layer/nodejs/
echo "[EXEC] npm install --production (nodejs layer)"
npm install --production

cd ../../