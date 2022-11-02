//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract HexlinkAccount is ReentrancyGuard {
    using Address for address;

    address private _owner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    modifier onlyOwner() {
        require(owner() == msg.sender, "HEXL001");
        _;
    }

    receive() external payable {
    }

    fallback(bytes calldata) external returns (bytes memory) {
        // for ERC1155 and ERC3525
        return abi.encode(msg.sig);
    }

    function owner() public view virtual returns (address) {
        if (_owner.isContract()) {
            return Ownable(_owner).owner();
        } else {
            return _owner;
        }
    }

    function initOwner(address ownerAddr) external {
        require(_owner == address(0) && ownerAddr != address(0), "HEXL005");
        _owner = ownerAddr;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "HEXL002");
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
        require(gasleft() > ((txGas * 64) / 63) + 500, "HEXL003");
        (
            bool success,
            /* bytes memory data */
        ) = destination.call{value: value, gas: txGas}(txData);
        require(success, "HEXL004");
    }
}
