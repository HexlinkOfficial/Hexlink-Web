export const HEXLINK = "0xbad6a7948a1d3031ee7236d0180b6271fa569148";

export const IERC20_ABI = [
  "function approve(address _spender, uint256 _value) public returns (bool success)",
  "function transfer(address _to, uint256 _value) public returns (bool success)",
  "function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)",
  "function balanceOf(address _owner) public view returns (uint256 balance)",
];

export const IERC721_ABI = [
  "function transferFrom(address, address, uint256) external",
];
