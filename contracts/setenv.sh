#!/bin/bash

mv data/HEXLINK.json data/HEXLINK.json.archive
mv data/CHAINS.json data/CHAINS.json.archive

doppler run -- npx hardhat metadata --network goerli | cat > data/HEXLINK.json
wget -O data/CHAINS.JSON https://chainid.network/chains_mini.json 

cp data/HEXLINK.json ../functions/src/
cp data/CHAINS.json ../functions/src/

cp data/CHAINS.json ../src/services/
cp data/HEXLINK.json ../src/services/
