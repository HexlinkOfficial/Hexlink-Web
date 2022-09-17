//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HexlinkToken is ERC20 {
    constructor() ERC20("Hexlink", "HEXL") {
        _mint(msg.sender, 1000000000000000000000000);
    }
}
