import {HardhatRuntimeEnvironment} from "hardhat/types";
import {DeployFunction} from "hardhat-deploy/types";
import {ethers} from "hardhat";
import {assert} from "console";

const parseDeployedWalletAddress = async function(
    hre: HardhatRuntimeEnvironment,
    receipt: any,
) {
  const {ethers, deployments} = hre;
  const artifact = await deployments.getArtifact("YawAdmin");
  const iface = new ethers.utils.Interface(artifact.abi);
  const topicHash = iface.getEventTopic("DeployWallet");
  const log = receipt.logs.find((log: any) => log.topics[0] == topicHash);
  return iface.parseLog(log).args.walletAddress;
};

const func: DeployFunction = async function(hre: HardhatRuntimeEnvironment) {
  const {deployments} = hre;
  const [deployer] = await ethers.getSigners();

  const deployment = await deployments.get("YawAdmin");
  const admin = await ethers.getContractAt("YawAdmin", deployment.address);
  const tx = await admin.connect(deployer).deploy();
  const receipt = await tx.wait();
  const deployedAddress = await parseDeployedWalletAddress(hre, receipt);

  const artifact = await deployments.getArtifact("YawWallet");
  const initCodeHash = ethers.utils.keccak256(artifact.bytecode);
  const computedAddress = ethers.utils.getCreate2Address(
      admin.address, ethers.constants.HashZero, initCodeHash);

  assert(deployedAddress == computedAddress, "Deployed address mismatch");
  const gas = receipt.gasUsed.mul(receipt.effectiveGasPrice).div(1000000000);
  console.log(
      // eslint-disable-next-line max-len
      `Deploying "YawWallet" (tx: ${tx.hash})...: deployed at ${deployedAddress} with ${gas} gas`
  );
};

export default func;
func.tags = ["YAW", "TEST"];
