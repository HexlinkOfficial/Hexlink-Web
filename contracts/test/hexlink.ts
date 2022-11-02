import {expect} from "chai";
import {ethers, deployments, artifacts} from "hardhat";

const sender = "mailto:sender@gmail.com";
const receiver = "mailto:receiver@gmail.com";

const getContract = async function(name: string) {
  const deployment = await deployments.get(name);
  return await ethers.getContractAt(name, deployment.address);
};

describe("Hexlink", function() {
  beforeEach(async function() {
    await deployments.fixture(["TEST"]);
  });

  it("Should deploy account base", async function() {
    const admin = await getContract("Hexlink");
    const artifact = await artifacts.readArtifact("HexlinkAccount");
    const initCodeHash = ethers.utils.keccak256(artifact.bytecode);
    const accountBase = ethers.utils.getCreate2Address(
        admin.address, ethers.constants.HashZero, initCodeHash);
    expect(await admin.accountBase()).to.eq(accountBase);
  });

  it("Should deploy account contract", async function() {
    const admin = await getContract("Hexlink");
    const [deployer] = await ethers.getSigners();
    const base = await admin.accountBase();
    const initCodeHash = ethers.utils.keccak256(ethers.utils.concat([
      ethers.utils.arrayify("0x363d3d373d3d3d363d73"),
      ethers.utils.arrayify(base),
      ethers.utils.arrayify("0x5af43d82803e903d91602b57fd5bf3"),
    ]));
    const nameHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(sender));

    // deploy account contract
    expect(await admin.nonce(nameHash)).to.eq(0);
    const account1 = await admin.addressOfName(nameHash)
    await expect(admin.connect(deployer).deploy(nameHash))
        .to.emit(admin, "SetAccount")
        .withArgs(nameHash, account1);
    expect(await admin.addressOfName(nameHash)).to.eq(account1);

    // check owner
    const accountContract1 = await ethers.getContractAt("HexlinkAccount", account1);
    expect(await accountContract1.owner()).to.eq(deployer.address);

    // redeploy should throw    
    await expect(admin.connect(deployer).deploy(nameHash))
      .to.be.reverted;

    // reset should success 
    const tx = await admin.connect(deployer).reset(nameHash);
    const receipt = await tx.wait();
    const args = receipt.events[0].args;
    expect(nameHash).to.eq(args.nameHash);
    expect(await admin.addressOfName(nameHash)).to.eq(args.account);
    expect(await admin.nonce(nameHash)).to.eq(1);
    // check owner
    const accountContract2 = await ethers.getContractAt("HexlinkAccount", args.account);
    expect(await accountContract2.owner()).to.eq(deployer.address);
  });

  it("Should transfer erc20 successfully", async function() {
    const token = await getContract("HexlinkToken");
    const admin = await getContract("Hexlink");
    const [deployer] = await ethers.getSigners();

    // deploy account contract implementation and compute target address
    const nameHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(sender));
    const accountAddr = await admin.addressOfName(nameHash);

    // receive tokens before account created
    await expect(
      token.connect(deployer).transfer(accountAddr, 5000)
    ).to.emit(token, "Transfer")
      .withArgs(deployer.address, accountAddr, 5000);
    expect(await token.balanceOf(accountAddr)).to.eq(5000);

    // deploy account contract
    await admin.connect(deployer).deploy(nameHash);
    const account = await ethers.getContractAt(
      "HexlinkAccount",
      accountAddr
    );

    // receive tokens after account created
    await expect(
      token.connect(deployer).transfer(accountAddr, 5000)
    ).to.emit(token, "Transfer")
      .withArgs(deployer.address, accountAddr, 5000);
    expect(await token.balanceOf(accountAddr)).to.eq(10000);

    // send tokens
    const artifact = await deployments.getArtifact("HexlinkToken");
    const iface = new ethers.utils.Interface(artifact.abi);
    const txData = iface.encodeFunctionData(
        "transfer",
        [deployer.address, 5000]
    );
    expect(await token.balanceOf(account.address)).to.eq(10000);
    await account.connect(deployer).execute(
        token.address, 0, 65000, txData
    );
    expect(await token.balanceOf(account.address)).to.eq(5000);
  });

  it("Should transfer eth successfully", async function() {
    const admin = await getContract("Hexlink");
    const [deployer] = await ethers.getSigners();

    // deploy account contract implementation and compute target address
    const nameHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(sender));
    const senderAddr = await admin.addressOfName(nameHash);

    // receive eth before account created
    const tx1 = await deployer.sendTransaction({
      to: senderAddr,
      value: ethers.utils.parseEther("1.0")
    });
    await tx1.wait();
    expect(
      await ethers.provider.getBalance(senderAddr)
    ).to.eq(ethers.utils.parseEther("1.0"));

    // create new account contract
    await admin.connect(deployer).deploy(nameHash);
    const account = await ethers.getContractAt("HexlinkAccount", senderAddr);

    // receive eth after account created
    const tx2 = await deployer.sendTransaction({
      to: senderAddr,
      value: ethers.utils.parseEther("1.0")
    });
    await tx2.wait();
    expect(
      await ethers.provider.getBalance(senderAddr)
    ).to.eq(ethers.utils.parseEther("2.0"));

    // send ETH
    const receiverAddr = await admin.addressOfName(
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes(receiver))
    );
    await account.connect(deployer).execute(
        receiverAddr, ethers.utils.parseEther("0.5"), 65000, []
    );
    expect(
      await ethers.provider.getBalance(receiverAddr)
    ).to.eq(ethers.utils.parseEther("0.5"));
  });

  it("Should hold and transfer ERC1155 successfully", async function() {
    const admin = await getContract("Hexlink");
    const erc1155 = await getContract("TestHexlinkERC1155");
    const [deployer] = await ethers.getSigners();

    // deploy account contract implementation and compute target address
    const nameHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(sender));
    const senderAddr = await admin.addressOfName(nameHash);

    // receive erc1155 before account created
    await expect(
      erc1155.connect(deployer).safeTransferFrom(
        deployer.address, senderAddr, 1, 10, []
      )
    ).to.emit(erc1155, "TransferSingle")
      .withArgs(deployer.address, deployer.address, senderAddr, 1, 10);
    expect(await erc1155.balanceOf(senderAddr, 1)).to.eq(10);

    // create new account contract
    await admin.connect(deployer).deploy(nameHash);
    const account = await ethers.getContractAt("HexlinkAccount", senderAddr);

    // receive erc1155 with contract
    await expect(
      erc1155.connect(deployer).safeTransferFrom(
        deployer.address, senderAddr, 1, 10, []
      )
    ).to.emit(erc1155, "TransferSingle")
      .withArgs(deployer.address, deployer.address, senderAddr, 1, 10);
    expect(await erc1155.balanceOf(senderAddr, 1)).to.eq(20);
  
    // send erc1155
    const artifact = await deployments.getArtifact("TestHexlinkERC1155");
    const iface = new ethers.utils.Interface(artifact.abi);
    const txData = iface.encodeFunctionData(
        "safeTransferFrom",
        [senderAddr, deployer.address, 1, 10, []]
    );
    await account.connect(deployer).execute(
        erc1155.address, 0, 65000, txData
    );
    expect(await erc1155.balanceOf(senderAddr, 1)).to.eq(10);
  });
});
