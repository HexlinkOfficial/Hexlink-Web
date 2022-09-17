//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract HexlinkWallet is ReentrancyGuard {
    using Address for address;

    address private _owner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    receive() external payable { 
    }

    fallback() external payable {
    }

    function owner() public view virtual returns (address) {
        if (_owner.isContract()) {
            return Ownable(_owner).owner();
        } else {
            return _owner;
        }
    }

    function _checkOwner() internal view virtual {
        require(owner() == msg.sender, "YAW001");
    }

    function initOwner(address ownerAddr) external {
        require(_owner == address(0) && ownerAddr != address(0), "YAW005");
        _owner = ownerAddr;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "YAW002");
        address oldOwner = owner();
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    function execute(
        address destination,
        uint256 value,
        uint256 txGas,
        bytes calldata txData
    ) external payable onlyOwner nonReentrant {
        require(gasleft() > ((txGas * 64) / 63) + 500, "YAW003");
        (
            bool success,
            /* bytes memory data */
        ) = destination.call{value: value, gas: txGas}(txData);
        require(success, "YAW004");
    }
}
