import {expect} from "chai";
import {ethers, deployments} from "hardhat";
import {Contract, providers} from "ethers";

const sender = "mailto:sender@gmail.com";
const receiver = "mailto:receiver@gmail.com";

const getContract = async function(name: string) {
  const deployment = await deployments.get(name);
  return await ethers.getContractAt(name, deployment.address);
};

const walletImplAddress = async function(admin: Contract) {
  const artifact = await deployments.getArtifact("HexlinkWallet");
  const initCodeHash = ethers.utils.keccak256(artifact.bytecode);
  return ethers.utils.getCreate2Address(
      admin.address, ethers.constants.HashZero, initCodeHash);
};

describe("Hexlink", function() {
  beforeEach(async function() {
    await deployments.fixture(["TEST"]);
  });

  it("Should clone wallet contract", async function() {
    const admin = await getContract("HexlinkAdmin");
    const [deployer] = await ethers.getSigners();

    const salt = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(sender));
    const implAddr = await walletImplAddress(admin);
    const walletAddr = await admin.predictWalletAddress(implAddr, salt);
    await expect(admin.connect(deployer).clone(implAddr, salt))
        .to.emit(admin, "DeployWallet")
        .withArgs(implAddr, salt, walletAddr);

    // check owner
    const wallet = await ethers.getContractAt("HexlinkWallet", walletAddr);
    expect(await wallet.owner()).to.eq(deployer.address);
  });

  it("Should transfer token successfully", async function() {
    const token = await getContract("HexlinkToken");
    const admin = await getContract("HexlinkAdmin");
    const [deployer] = await ethers.getSigners();

    // deploy wallet contract implementation and compute target address
    const implAddr = await walletImplAddress(admin);
    const salt = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(sender));
    const walletAddr = await admin.predictWalletAddress(implAddr, salt);

    // receive tokens before wallet created
    await expect(
        token.connect(deployer).transfer(walletAddr, 10000)
    ).to.emit(token, "Transfer")
        .withArgs(deployer.address, walletAddr, 10000);
    expect(await token.balanceOf(walletAddr)).to.eq(10000);

    // create new wallet contract
    await admin.connect(deployer).clone(implAddr, salt);
    const wallet = await ethers.getContractAt("HexlinkWallet", walletAddr);

    // send tokens
    const artifact = await deployments.getArtifact("HexlinkToken");
    const iface = new ethers.utils.Interface(artifact.abi);
    const txData = iface.encodeFunctionData(
        "transfer",
        [deployer.address, 5000]
    );
    expect(await token.balanceOf(wallet.address)).to.eq(10000);
    await wallet.connect(deployer).execute(
        token.address, 0, 65000, txData
    );
    expect(await token.balanceOf(wallet.address)).to.eq(5000);
  });

  it("Should transfer eth successfully", async function() {
    const token = await getContract("HexlinkToken");
    const admin = await getContract("HexlinkAdmin");
    const [deployer] = await ethers.getSigners();

    // deploy wallet contract implementation and compute target address
    const implAddr = await walletImplAddress(admin);
    const salt = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(sender));
    const senderAddr = await admin.predictWalletAddress(implAddr, salt);

    // receive eth before wallet created
    const tx = await deployer.sendTransaction({
      to: senderAddr,
      value: ethers.utils.parseEther("1.0")
    });
    await tx.wait();
    expect(
      await ethers.provider.getBalance(senderAddr)
    ).to.eq(ethers.utils.parseEther("1.0"));

    // create new wallet contract
    await admin.connect(deployer).clone(implAddr, salt);
    const wallet = await ethers.getContractAt("HexlinkWallet", senderAddr);

    // send ETH
    const receiverAddr = await admin.predictWalletAddress(
        implAddr, ethers.utils.keccak256(ethers.utils.toUtf8Bytes(receiver))
    );
    await wallet.connect(deployer).execute(
        receiverAddr, ethers.utils.parseEther("0.5"), 65000, []
    );
    expect(
      await ethers.provider.getBalance(receiverAddr)
    ).to.eq(ethers.utils.parseEther("0.5"));
  });
});
