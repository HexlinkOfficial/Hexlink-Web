//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract HexlinkIdentityOracle {
    struct Verifier {
        bool enabled;
        uint128 nonce;
    }

    struct AuthProof {
        address verifier;
        uint64 expiredAt;
        bytes32 user;
        bytes signature;
    }

    bytes32 internal constant MESSAGE = keccak256("VALID_AUTH_PROOF");
    mapping(address => Verifier) nonces_;

    function validate(AuthProof calldata authProof) external {

    }
}