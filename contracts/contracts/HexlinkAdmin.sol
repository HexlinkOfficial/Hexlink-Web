//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "./HexlinkWallet.sol";

contract HexlinkAdmin is Ownable {
    event DeployWalletBase(address walletAddress);
    event DeployWallet(address source, bytes32 salt, address newWalletAddress);

    function deploy() external onlyOwner {
        address wallet = Create2.deploy(0, bytes32(0), type(HexlinkWallet).creationCode);
        emit DeployWalletBase(wallet);
    }

    function clone(address source, bytes32 salt) external onlyOwner {
        address payable cloned = payable(Clones.cloneDeterministic(source, salt));
        HexlinkWallet(cloned).initOwner(address(this));
        emit DeployWallet(source, salt, cloned);
    }

    function predictWalletAddress(address source, bytes32 salt) external view returns(address) {
        return Clones.predictDeterministicAddress(source, salt);
    }
}
