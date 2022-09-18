import {task} from "hardhat/config";
import {assert} from "console";
import {Contract} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import { AimOutlined } from "@ant-design/icons-vue";

const genSalt = function(ethers: any, email: string) {
  return ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(`mailto:${email}`)
  );
};

const getAdmin = async function(hre: HardhatRuntimeEnvironment) {
  const {ethers, deployments} = hre;
  const deployment = await deployments.get("HexlinkAdmin");
  return await ethers.getContractAt("HexlinkAdmin", deployment.address);
};

const genTopicHash = async function(
    hre: HardhatRuntimeEnvironment,
    contract: string,
    func: string
) {
  const {ethers, deployments} = hre;
  const artifact = await deployments.getArtifact(contract);
  const iface = new ethers.utils.Interface(artifact.abi);
  return iface.getEventTopic(func);
};

const parseClonedWalletAddress = async function(
    hre: HardhatRuntimeEnvironment,
    receipt: any,
) {
  const {ethers, deployments} = hre;
  const topicHash = await genTopicHash(hre, "HexlinkAdmin", "CloneWallet");
  const log = receipt.logs.find((log: any) => log.topics[0] == topicHash);
  const artifact = await deployments.getArtifact("HexlinkAdmin");
  const iface = new ethers.utils.Interface(artifact.abi);
  return iface.parseLog(log).args.cloned;
};

const walletImplAddress = async function(
    hre: HardhatRuntimeEnvironment,
    admin: Contract,
) {
  const {ethers, artifacts} = hre;
  const artifact = await artifacts.readArtifact("HexlinkWallet");
  const initCodeHash = ethers.utils.keccak256(artifact.bytecode);
  return ethers.utils.getCreate2Address(
      admin.address, ethers.constants.HashZero, initCodeHash);
};

task("walletImplAddress", "Prints wallet implementation contract address")
    .addFlag("print", "print wallet implementation address")
    .setAction(async (taskArgs, hre : HardhatRuntimeEnvironment) => {
      const {ethers, artifacts} = hre;
      const admin = await getAdmin(hre);
      const artifact = await artifacts.readArtifact("HexlinkWallet");
      const initCodeHash = ethers.utils.keccak256(artifact.bytecode);
      const address = ethers.utils.getCreate2Address(
          admin.address, ethers.constants.HashZero, initCodeHash);
      if (taskArgs.print) {
        console.log("Wallet Implementation address is " + address);
      }
      return address;
    });

task("walletAddress", "Prints wallet address")
    .addFlag("print", "print wallet address")
    .addParam("email", "the email address to generate the address")
    .setAction(async (taskArgs, hre : HardhatRuntimeEnvironment) => {
      const {ethers} = hre;
      const admin = await getAdmin(hre);
      const source = await walletImplAddress(hre, admin);
      const address = await admin.predictWalletAddress(
          source, genSalt(ethers, taskArgs.email)
      );
      console.log(admin.address);
      if (taskArgs.print) {
        console.log("Wallet address is " + address);
      }
      return address;
    });

task("clone", "clone a new wallet per given email")
    .addFlag("print", "print cloned wallet address")
    .addFlag("async", "do not wait for transaction to finish")
    .addParam("email", "the email address to generate the address")
    .setAction(async (taskArgs, hre : HardhatRuntimeEnvironment) => {
      const {ethers} = hre;
      const admin = await getAdmin(hre);
      const source = await walletImplAddress(hre, admin);
      const salt = genSalt(ethers, taskArgs.email);
      const computedAddress = await admin.predictWalletAddress(source, salt);

      const [deployer] = await ethers.getSigners();
      const tx = await admin.connect(deployer).clone(source, salt);
      if (taskArgs.async) {
        console.log(`Cloning "HexlinkWallet" (tx: ${tx.hash})...`);
        return tx.hash;
      }
      const receipt = await tx.wait();
      const deployedAddress = await parseClonedWalletAddress(hre, receipt);
      assert(
          computedAddress == deployedAddress,
          // eslint-disable-next-line max-len
          `Wallet address mismatch, expected ${computedAddress} but got ${deployedAddress}`
      );

      if (taskArgs.print) {
        const gas = receipt.gasUsed.mul(
            receipt.effectiveGasPrice
        ).div(1000000000);
        console.log(
            // eslint-disable-next-line max-len
            `Cloning "HexlinkWallet" (tx: ${tx.hash})...: cloned at ${deployedAddress} with ${gas} gas`
        );
      }
      return deployedAddress;
    });

task("receiveETH", "receiveETH")
    .addParam("receiver", "receiver email")
    .setAction(async (taskArgs, hre : HardhatRuntimeEnvironment) => {
      const {ethers} = hre;
      const [deployer] = await ethers.getSigners();
      const receiver: string = await hre.run("walletAddress", {email: taskArgs.receiver});
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
      const sender = await hre.run("walletAddress", {email: taskArgs.sender});
      const receiver = await hre.run("walletAddress", {email: taskArgs.receiver});
      const wallet = await ethers.getContractAt(
          "HexlinkWallet",
          sender,
      );
      const tx = await wallet.connect(deployer).execute(
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
      const sender = await hre.run("walletAddress", {email: taskArgs.sender});
      const receiver = await hre.run("walletAddress", {email: taskArgs.receiver});
      const token = (await hre.deployments.get("HexlinkToken")).address;

      const wallet = await ethers.getContractAt(
          "HexlinkWallet",
          sender,
      );
      const artifact = await hre.artifacts.readArtifact("ERC20");
      const iface = new ethers.utils.Interface(artifact.abi);
      const txData = iface.encodeFunctionData(
          "transfer",
          [receiver, ethers.utils.parseEther(taskArgs.amount)]
      );
      const tx = await wallet.connect(deployer).execute(
          token, 0, 65000, txData
      );
      return tx.hash;
    });

task("execute", "execute abiratry transaction")
    .addParam("wallet", "wallet address to exectute")
    .addParam("contract", "address of contract to call")
    .addParam("txData", "transaction data to exectute")
    .setAction(async (taskArgs, hre : HardhatRuntimeEnvironment) => {
      const {ethers} = hre;
      const [deployer] = await ethers.getSigners();
      const destination = ethers.utils.getAddress(taskArgs.destination);
      const wallet = await ethers.getContractAt(
          "HexlinkWallet",
          ethers.utils.getAddress(taskArgs.wallet)
      );
      const tx = await wallet.connect(deployer).execute(
          destination, 0, 65000, taskArgs.txData
      );
      return tx.hash;
    });

task("metadata", "generate metadata")
    .setAction(async (_taskArgs, hre : HardhatRuntimeEnvironment) => {
      const admin = await hre.deployments.get("HexlinkAdmin");
      const token = await hre.deployments.get("HexlinkToken");
      const walletArtifact = await hre.artifacts.readArtifact("HexlinkWallet");

      const metadata = JSON.stringify({
        adminAddr: admin.address,
        adminAbi: admin.abi,
        walletImplAbi: walletArtifact.abi,
        walletImplAddr: await hre.run("walletImplAddress", {}),
        walletImplBytecode: walletArtifact.bytecode,
        tokenAddr: token.address,
      });
      console.log(metadata);
      return metadata;
    });
