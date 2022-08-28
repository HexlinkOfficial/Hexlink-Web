//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "./YawWallet.sol";

contract YawAdmin is Ownable {
    event InitWallet(address walletAddress);
    event NewWallet(address newWallet);

    function init() external onlyOwner {
        address wallet = Create2.deploy(0, 0, type(YawWallet).creationCode);
        emit InitWallet(wallet);
    }

    function create(
        address walletImplAddress,
        bytes32 salt
    ) external onlyOwner {
        address cloned = Clones.cloneDeterministic(
            walletImplAddress,
            salt
        );
        emit NewWallet(cloned);
    }
}
