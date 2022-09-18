#!/bin/bash

doppler run -- npx hardhat metadata --network goerli | cat > HEXLINK.json

cp HEXLINK.json ../functions/src/

cp HEXLINK.json ../src/services/
