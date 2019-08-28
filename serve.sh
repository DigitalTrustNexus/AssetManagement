#!/usr/bin/env bash

VERSION="0.1"
set -o errexit
set -o nounset
set -o pipefail

if [ -z "${VERSION}" ]; then
    echo "VERSION must be set"
    exit 1
fi
npm rebuild
npm install
npm start

GOPATH=$PWD node deploy.js
