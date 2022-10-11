//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract HexlinkNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private currentTokenId;

    constructor() ERC721("HexlinkNFT", "NFT") {
        currentTokenId.increment();
        uint256 newItemId = currentTokenId.current();

        _mint(msg.sender, newItemId);
    }
}
