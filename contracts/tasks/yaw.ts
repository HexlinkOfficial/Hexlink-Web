import {task} from "hardhat/config";
import {assert} from "console";
import {Contract} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";

const genSalt = function(ethers: any, email: string) {
  return ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(`mailto:${email}`)
  );
};

const getAdmin = async function(hre: HardhatRuntimeEnvironment) {
  const {ethers, deployments} = hre;
  const deployment = await deployments.get("YawAdmin");
  return await ethers.getContractAt("YawAdmin", deployment.address);
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
  const topicHash = await genTopicHash(hre, "YawAdmin", "CloneWallet");
  const log = receipt.logs.find((log: any) => log.topics[0] == topicHash);
  const artifact = await deployments.getArtifact("YawAdmin");
  const iface = new ethers.utils.Interface(artifact.abi);
  return iface.parseLog(log).args.cloned;
};

const walletImplAddress = async function(
    hre: HardhatRuntimeEnvironment,
    admin: Contract,
) {
  const {ethers, artifacts} = hre;
  const artifact = await artifacts.readArtifact("YawWallet");
  const initCodeHash = ethers.utils.keccak256(artifact.bytecode);
  return ethers.utils.getCreate2Address(
      admin.address, ethers.constants.HashZero, initCodeHash);
};

task("walletImplAddress", "Prints yaw wallet implementation contract address")
    .addFlag("print", "print wallet implementation address")
    .setAction(async (taskArgs, hre : HardhatRuntimeEnvironment) => {
      const {ethers, artifacts} = hre;
      const admin = await getAdmin(hre);
      const artifact = await artifacts.readArtifact("YawWallet");
      const initCodeHash = ethers.utils.keccak256(artifact.bytecode);
      const address = ethers.utils.getCreate2Address(
          admin.address, ethers.constants.HashZero, initCodeHash);
      if (taskArgs.print) {
        console.log("Wallet Implementation address is " + address);
      }
      return address;
    });

task("walletAddress", "Prints yaw wallet address")
    .addFlag("print", "print wallet address")
    .addParam("email", "the email address to generate the address")
    .setAction(async (taskArgs, hre : HardhatRuntimeEnvironment) => {
      const {ethers} = hre;
      const admin = await getAdmin(hre);
      const source = await walletImplAddress(hre, admin);
      const address = await admin.predictWalletAddress(
          source, genSalt(ethers, taskArgs.email)
      );
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
        console.log(`Cloning "YawWallet" (tx: ${tx.hash})...`);
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
            `Cloning "YawWallet" (tx: ${tx.hash})...: cloned at ${deployedAddress} with ${gas} gas`
        );
      }
      return deployedAddress;
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
          "YawWallet",
          ethers.utils.getAddress(taskArgs.wallet)
      );
      const tx = await wallet.connect(deployer).execute(
          destination, 0, 65000, taskArgs.txData
      );
      return tx.hash;
    });
