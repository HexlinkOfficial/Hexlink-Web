import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import type { Contract } from "ethers";

const email = "mailto:test@gmail.com";

const getContract = async function(name: string) {
    var deployment = await deployments.get(name);
    return await ethers.getContractAt(name, deployment.address);
}

const walletImplAddress = async function(admin: Contract) {
    const artifact = await deployments.getArtifact("YawWallet");
    const initCodeHash = ethers.utils.keccak256(artifact.bytecode);
    return ethers.utils.getCreate2Address(
        admin.address, ethers.constants.HashZero, initCodeHash);
}

describe("Yaw", function () {
  beforeEach(async function() {
      await deployments.fixture(['TEST']);
  });

  it.only("Should parse log", async function () {
    const admin = await getContract('YawAdmin');
    const [deployer] = await ethers.getSigners();

    const salt = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(email));
    const implAddr = await walletImplAddress(admin);
    const walletAddr = await admin.predictWalletAddress(implAddr, salt);
    const tx = await admin.connect(deployer).clone(implAddr, salt);

    const receipt = await tx.wait();
    const artifact = await deployments.getArtifact("YawAdmin");
    const iface = new ethers.utils.Interface(artifact.abi);
    const log = iface.parseLog(receipt.logs[0]);
    console.log(log.args.cloned);
    console.log(walletAddr);
  });

  it("Should clone wallet contract", async function () {
    const admin = await getContract('YawAdmin');
    const [deployer] = await ethers.getSigners();

    const salt = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(email));
    const implAddr = await walletImplAddress(admin);
    const walletAddr = await admin.predictWalletAddress(implAddr, salt);
    await expect(admin.connect(deployer).clone(implAddr, salt))
        .to.emit(admin, 'CloneWallet')
        .withArgs(implAddr, salt, walletAddr);

    // check owner
    const wallet = await ethers.getContractAt("YawWallet", walletAddr);
    expect(await wallet.owner()).to.eq(deployer.address);
  });

  it("Should transfer token successfully", async function () {
    const token = await getContract("YawToken");
    const admin = await getContract('YawAdmin');
    const [deployer] = await ethers.getSigners();

    // deploy wallet contract implementation and compute target address
    const implAddr = await walletImplAddress(admin);
    const salt = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(email));
    const walletAddr = await admin.predictWalletAddress(implAddr, salt);

    // receive tokens before token created
    await expect(
        token.connect(deployer).transfer(walletAddr, 10000)
    ).to.emit(token, "Transfer")
     .withArgs(deployer.address, walletAddr, 10000);
     expect(await token.balanceOf(walletAddr)).to.eq(10000);

    // create new wallet contract
    await admin.connect(deployer).clone(implAddr, salt)
    const wallet = await ethers.getContractAt("YawWallet", walletAddr);

    // send tokens
    const artifact = await deployments.getArtifact("YawToken");
    const iface = new ethers.utils.Interface(artifact.abi);
    const txData = iface.encodeFunctionData(
        "transfer",
        [deployer.address, 5000]
    );
    await wallet.connect(deployer).execute(
        token.address, 0, 65000, txData
    );
    expect(await token.balanceOf(wallet.address)).to.eq(5000);
  });
});
