//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract TestHexlinkERC1155 is ERC1155 {
    constructor() ERC1155("uri") {
        uint256[] memory ids = new uint256[](3);
        ids[0] = 0;
        ids[1] = 1;
        ids[2] = 2;
        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 1000;
        amounts[1] = 1000;
        amounts[2] = 1000;
        _mintBatch(msg.sender, ids, amounts, "");
    }
}
