#!/bin/bash

network=${1:-rinkeby}
description=${2:-'the latest '}

# Later: use $2 to further specify which deployment

echo loading $description deployment from $network ...

if [ ! -d ./build ]; then
    echo "creating local build folder..."
    mkdir build
    mkdir build/contracts
fi

cp  ./deployments/$network/*.json ./build/contracts/

echo Success!
