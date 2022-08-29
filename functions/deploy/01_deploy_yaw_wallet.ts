import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers } from 'hardhat';
import { assert } from 'console';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments } = hre;
  const [deployer] = await ethers.getSigners();

  const deployment = await deployments.get("YawAdmin");
  const admin = await ethers.getContractAt("YawAdmin", deployment.address);
  const tx = await admin.connect(deployer).deploy();
  const receipt = await tx.wait();

  const adminArtifact = await deployments.getArtifact("YawAdmin");
  const adminIface = new ethers.utils.Interface(adminArtifact.abi);
  const topicHash = adminIface.getEventTopic("DeployWallet");
  const log = receipt.logs.find(log => log.topics[0] == topicHash);
  const [deployedAddress] = ethers.utils.defaultAbiCoder.decode(['address'], log!.data);

  const artifact = await deployments.getArtifact("YawWallet");
  const initCodeHash = ethers.utils.keccak256(artifact.bytecode);
  const computedAddress = ethers.utils.getCreate2Address(
      admin.address, ethers.constants.HashZero, initCodeHash);

  assert(deployedAddress == computedAddress, "Deployed address mismatch");
  const gas = receipt.gasUsed.mul(receipt.effectiveGasPrice).div(1000000000);
  console.log(`Deploying "YawWallet" (tx: ${tx.hash})...: deployed at ${deployedAddress} with ${gas} gas`);
};

export default func;
func.tags = ['YAW', 'TEST'];
