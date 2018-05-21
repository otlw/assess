#!/bin/bash

network=${1:-rinkeby}
description=${2:-'the latest shit'}
# Later: create $3 save multiple deployments to the same network

if [ ! -d ./deployments/$network ]; then
    mkdir deployments/$network
fi

cp ./build/contracts/* ./deployments/$network

echo $description > ./deployments/$network/README.txt

echo "all files copied to /deployments/"$network
