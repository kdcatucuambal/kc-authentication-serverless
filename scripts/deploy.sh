#!/bin/sh
sam --version
aws --version
pwd
ls -la

packageVars=$(python3 scripts/python/parameters.py 'package')

cd .stack/

echo "[EXEC] sam package --template-file template.yaml ${packageVars} --output-template-file packaged.yaml"
sam package --template-file ../template.yaml ${packageVars} --output-template-file packaged.yaml

cd ../
deployVars=$(python3 scripts/python/parameters.py 'deploy')
cd .stack/
#Sam deploy
echo "[EXEC] sam deploy --template-file packaged.yaml ${deployVars}"
sam deploy --template-file packaged.yaml ${deployVars}