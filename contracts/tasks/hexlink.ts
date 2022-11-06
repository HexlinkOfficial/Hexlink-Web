import {task} from "hardhat/config";
import {HardhatRuntimeEnvironment} from "hardhat/types";

const genNameHash = function(ethers: any, email: string) {
  return ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(`mailto:${email}`)
  );
};

const getAdmin = async function(hre: HardhatRuntimeEnvironment) {
  const {ethers, deployments} = hre;
  const deployment = await deployments.get("Hexlink");
  return await ethers.getContractAt("Hexlink", deployment.address);
};

task("accountBase", "Prints account base address")
    .addFlag("print", "print account base address")
    .addParam("email", "the email address to generate the address")
    .setAction(async (taskArgs, hre : HardhatRuntimeEnvironment) => {
      const nameHash = genNameHash(hre.ethers, taskArgs.email);
      const admin = await getAdmin(hre);
      const account = await admin.addressOfName(nameHash);
      if (taskArgs.print) {
        console.log("account base address is " + account);
      }
      return account;
    });

task("accountAddress", "Prints account address")
    .addFlag("print", "print account address")
    .setAction(async (taskArgs, hre : HardhatRuntimeEnvironment) => {
      const admin = await getAdmin(hre);
      const base = await admin.accountBase();
      if (taskArgs.print) {
        console.log("account address is " + base);
      }
      return base;
    });

task("deployAccount", "deploy a new account per given email")
    .addFlag("print", "print cloned account address")
    .addFlag("async", "do not wait for transaction to finish")
    .addParam("email", "the email address to generate the address")
    .setAction(async (taskArgs, hre : HardhatRuntimeEnvironment) => {
      const {ethers} = hre;
      const admin = await getAdmin(hre);
      const nameHash = genNameHash(ethers, taskArgs.email);

      const [deployer] = await ethers.getSigners();
      const tx = await admin.connect(deployer).deploy(nameHash);
      if (taskArgs.async) {
        console.log(`Cloning "HexlinkAccount" (tx: ${tx.hash})...`);
        return tx.hash;
      }
      const receipt = await tx.wait();
      const account = await admin.addressOfName(nameHash);
      if (taskArgs.print) {
        const gas = receipt.gasUsed.mul(
            receipt.effectiveGasPrice
        ).div(1000000000);
        console.log(
            // eslint-disable-next-line max-len
            `Cloning "HexlinkAccount" (tx: ${tx.hash})...: cloned at ${account} with ${gas} gas`
        );
      }
      return account;
    });

task("receiveETH", "receiveETH")
    .addParam("receiver", "receiver email")
    .setAction(async (taskArgs, hre : HardhatRuntimeEnvironment) => {
      const {ethers} = hre;
      const [deployer] = await ethers.getSigners();
      const receiver: string = await hre.run("accountAddress", {email: taskArgs.receiver});
      const amount = ethers.utils.parseEther("0.01")
      const tx = await deployer.sendTransaction({
        to: receiver,
        value: amount
      });
      return tx.hash;
    });

task("sendETH", "send ETH")
    .addParam("sender", "sender email")
    .addParam("receiver", "receiver email")
    .addParam("amount", "amount of ETH to send")
    .setAction(async (taskArgs, hre : HardhatRuntimeEnvironment) => {
      const {ethers} = hre;
      const [deployer] = await ethers.getSigners();
      const sender = await hre.run("account", {email: taskArgs.sender});
      const receiver = await hre.run("account", {email: taskArgs.receiver});
      const account = await ethers.getContractAt(
          "HexlinkAccount",
          sender,
      );
      const tx = await account.connect(deployer).execute(
        receiver, ethers.utils.parseEther(taskArgs.amount), 23000, []
      );
      return tx.hash;
    });

task("sendHexl", "send hexlink token")
    .addParam("sender", "sender email")
    .addParam("receiver", "receiver email")
    .addParam("amount", "amount of ETH to send")
    .setAction(async (taskArgs, hre : HardhatRuntimeEnvironment) => {
      const {ethers} = hre;
      const [deployer] = await ethers.getSigners();
      const sender = await hre.run("account", {email: taskArgs.sender});
      const receiver = await hre.run("account", {email: taskArgs.receiver});
      const token = (await hre.deployments.get("HexlinkToken")).address;

      const account = await ethers.getContractAt(
          "HexlinkAccount",
          sender,
      );
      const artifact = await hre.artifacts.readArtifact("ERC20");
      const iface = new ethers.utils.Interface(artifact.abi);
      const txData = iface.encodeFunctionData(
          "transfer",
          [receiver, ethers.utils.parseEther(taskArgs.amount)]
      );
      const tx = await account.connect(deployer).execute(
          token, 0, 65000, txData
      );
      return tx.hash;
    });

task("execute", "execute abiratry transaction")
    .addParam("account", "account address to exectute")
    .addParam("contract", "address of contract to call")
    .addParam("txData", "transaction data to exectute")
    .setAction(async (taskArgs, hre : HardhatRuntimeEnvironment) => {
      const {ethers} = hre;
      const [deployer] = await ethers.getSigners();
      const destination = ethers.utils.getAddress(taskArgs.destination);
      const account = await ethers.getContractAt(
          "HexlinkAccount",
          ethers.utils.getAddress(taskArgs.account)
      );
      const tx = await account.connect(deployer).execute(
          destination, 0, 65000, taskArgs.txData
      );
      return tx.hash;
    });

task("metadata", "generate metadata")
    .setAction(async (_taskArgs, hre : HardhatRuntimeEnvironment) => {
      const admin = await hre.deployments.get("Hexlink");
      const adminContract = await hre.ethers.getContractAt("Hexlink", admin.address);
      const base = await adminContract.accountBase();
      const token = await hre.deployments.get("HexlinkToken");
      const accountArtifact = await hre.artifacts.readArtifact("HexlinkAccount");

      const metadata = JSON.stringify({
        adminAddr: admin.address,
        adminAbi: admin.abi,
        accountAbi: accountArtifact.abi,
        accountBase: base,
        accountBaseBytecode: accountArtifact.bytecode,
        tokenAddr: token.address,
      });
      console.log(metadata);
      return metadata;
    });

task("mint", "Mints from the NFT cxontract")
    .addParam("address", "The address to receive a token")
    .setAction(async function (taskArguments, hre: HardhatRuntimeEnvironment) {
      const {ethers} = hre;
      const contract = await ethers.getContractAt(
        "HexlinkNFT",
        "0x5FcbC0DD3ff625E64b9cC4337641e4861a1e791E",
      );
      const transactionResponse = await contract.mintTo(taskArguments.address, {
        gasLimit: 500000,
      });
      console.log(`Transaction Hash: ${transactionResponse.hash}`);
    });

task("set-base-token-uri", "Sets the base token URI for the deployed smart contract")
    .addParam("baseUrl", "The base of the tokenURI endpoint to set")
    .setAction(async function (taskArguments, hre: HardhatRuntimeEnvironment) {
      const {ethers} = hre;
      const contract = await ethers.getContractAt(
        "HexlinkNFT",
        "0x5FcbC0DD3ff625E64b9cC4337641e4861a1e791E",
      );
      const transactionResponse = await contract.setBaseTokenURI(taskArguments.baseUrl, {
        gasLimit: 500000,
      });
      console.log(`Transaction Hash: ${transactionResponse.hash}`);
    });

task("token-uri", "Fetches the token metadata for the given token ID")
    .addParam("tokenId", "The tokenID to fetch metadata for")
    .setAction(async function (taskArguments, hre: HardhatRuntimeEnvironment) {
      const {ethers} = hre;
      const contract = await ethers.getContractAt(
        "HexlinkNFT",
        "0x5FcbC0DD3ff625E64b9cC4337641e4861a1e791E",
      );
      const response = await contract.tokenURI(taskArguments.tokenId, {
        gasLimit: 500000,
      });
        
      const metadata_url = response;
      console.log(`Metadata URL: ${metadata_url}`);
    
      const metadata = await fetch(metadata_url).then(res => res.json());
      console.log(`Metadata fetch response: ${JSON.stringify(metadata, null, 2)}`);
    });

task("sendNFT", "send NFT")
    .addParam("sender", "sender email")
    .addParam("receiver", "receiver email")
    .addParam("collection", "collection address")
    .addParam("id", "token ID")
    .setAction(async (taskArgs, hre : HardhatRuntimeEnvironment) => {
      const {ethers} = hre;
      const [deployer] = await ethers.getSigners();
      const sender = await hre.run("account", {email: taskArgs.sender});
      const receiver = await hre.run("account", {email: taskArgs.receiver});

      const account = await ethers.getContractAt(
          "HexlinkAccount",
          sender,
      );
      const artifact = await hre.artifacts.readArtifact("ERC721");
      const iface = new ethers.utils.Interface(artifact.abi);
      const txData = iface.encodeFunctionData(
          "safeTransferFrom",
          [sender, receiver, taskArgs.token_id]
      );
      const tx = await account.connect(deployer).execute(
          taskArgs.collection, 0, 65000, txData
      );
      return tx.hash;
    });
