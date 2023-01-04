export const ADMIN = "0xbad6a7948a1d3031ee7236d0180b6271fa569148";

export const ADMIN_ABI = [
  "function addressOfName(bytes32) external view returns(address)",
];

export const ACCOUNT_ABI = [
  // eslint-disable-next-line max-len
  "function execute(address, uint256, uint256, bytes calldata) external payable",
];

export const ERC20_ABI = [
  "function transfer(address, uint256) external returns (bool)",
];

export const ERC721_ABI = [
  "function transferFrom(address, address, uint256) external",
];
