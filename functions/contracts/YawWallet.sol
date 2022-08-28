//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract YawWallet is ReentrancyGuard {
    Ownable constant public ADMIN = Ownable(0xE0f5206BBD039e7b0592d8918820024e2a7437b9);
    address private _owner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    modifier onlyOwner() { _checkOwner();
        _;
    }

    function owner() public view virtual returns (address) {
        return _owner == address(0) ? ADMIN.owner() : _owner;
    }

    function _checkOwner() internal view virtual {
        require(owner() == msg.sender, "YAW001");
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
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
