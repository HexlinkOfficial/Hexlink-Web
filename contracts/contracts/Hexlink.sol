//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./HexlinkAccount.sol";

contract Hexlink is Ownable {
    using Address for address;

    event SetAccount(bytes32 indexed nameHash, address indexed account);

    address immutable accountBase_;
    mapping(bytes32 => uint256) private nonces_;

    constructor() {
        accountBase_ = Create2.deploy(0, bytes32(0), type(HexlinkAccount).creationCode);
    }

    function deploy(bytes32 nameHash) public onlyOwner {
        deployImpl(nameHash, nonces_[nameHash]);
    }

    function reset(bytes32 nameHash) public onlyOwner {
        uint256 n = nonces_[nameHash] + 1;
        nonces_[nameHash] = n;
        deployImpl(nameHash, n);
    }

    function addressOfName(bytes32 nameHash) external view returns(address) {
        bytes32 salt = genSalt(nameHash, nonces_[nameHash]);
        return Clones.predictDeterministicAddress(accountBase_, salt);
    }

    function accountBase() external view returns(address) {
        return accountBase_;
    }

    function nonce(bytes32 nameHash) external view returns(uint256) {
        return nonces_[nameHash];
    }

    function deployImpl(bytes32 nameHash, uint256 n) internal {
        bytes32 salt = genSalt(nameHash, n);
        address payable cloned = payable(
            Clones.cloneDeterministic(accountBase_, salt));
        HexlinkAccount(cloned).initOwner(address(this));
        emit SetAccount(nameHash, cloned);
    }

    function genSalt(bytes32 nameHash, uint256 n) internal pure returns(bytes32) {
        return keccak256(abi.encodePacked(nameHash, n));
    }
}
