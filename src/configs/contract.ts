export const HEXLINK = {
  "goerli": "0xbad6a7948a1d3031ee7236d0180b6271fa569148",
  "mumbai": "0x78317ef8b020Fe10e845ab8723403cF1e58Ef1Cc",
};

export const IERC20_ABI = [
  "function approve(address _spender, uint256 _value) public returns (bool success)",
  "function transfer(address _to, uint256 _value) public returns (bool success)",
  "function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)",
  "function balanceOf(address _owner) public view returns (uint256 balance)",
];

export const IERC721_ABI = [
  "function transferFrom(address, address, uint256) external",
];