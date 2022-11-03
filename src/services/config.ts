export const ADMIN = "0x3E4daF49356B097E73D042d565eBC1e2Bb017d42";

export const ADMIN_ABI = [
  "event SetAccount(bytes32 indexed, address indexed)",
  "function addressOfName(bytes32) external view returns(address)",
  "function deploy(bytes32) external",
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
