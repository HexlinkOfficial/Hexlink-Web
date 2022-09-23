# Hexlink Contracts

```shell
# compile contracts
npx hardhat compile

# run tests
npx hardhat clean

# get metadata of deployed contracts
npx hardhat metadata

# deploy to local
doppler run -- npx hardhat deploy

# deploy to goerli testnet
doppler run -- npx hardhat deploy --network goerli
```

# Etherscan verification

```shell
doppler run -- npx hardhat run --network ropsten scripts/sample-script.ts
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
ndoppler run -- npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS $CONSTRUCTOR_PARAMS
```

# Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details see [the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations).
