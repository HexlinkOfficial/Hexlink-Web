import { Network, Alchemy, type Media, type OwnedNft } from "alchemy-sdk";

const config = {
  apiKey: import.meta.env.VITE_GOERLI_ALCHEMY_KEY,
  network: getNetwork(),
};
const alchemy = new Alchemy(config);

function getNetwork() : Network {
  if (import.meta.env.VITE_HARDHAT_NETWORK == 'goerli') {
    return Network.ETH_GOERLI; 
  }
  return Network.ETH_MAINNET;
}

export interface NFTMetadata {
  title: string;
  rawMedia: string;
  externalUrl?: string;
}

export interface ContractMetadata {
  name?: string;
  symbol?: string;
  collectionName?: string;
  //collectionCover: string;
  //externalUrl: string;
  //discordUrl: string;
  //twitterUsername: string;
}

export interface NFT {
  address: string;
  tokenId: string;
  tokenMetadata: NFTMetadata;
  contractMetadata?: ContractMetadata;
}

export async function getNFTs(owner: string) : Promise<OwnedNft[]> {
  const nfts = await alchemy.nft.getNftsForOwner(owner);
  if (nfts.ownedNfts == null) {
    console.warn("No NFTs available for the owner, %s", owner);
    return [];
  }
    
  return nfts.ownedNfts;
}

export async function getNFTTokenMetadata(address: string, tokenId: string) {
  return await alchemy.nft.getNftMetadata(address, tokenId);
}

export async function getContractMetadata(address: string) {
  return await alchemy.nft.getContractMetadata(address);
}

export async function getNFTMetadata(address: string, tokenId: string) : Promise<NFT> {  
  let nft = {} as NFT;
  nft.address = address;
  nft.tokenId = tokenId;

  // Fetch token metadata for the NFT
  const nftTokenMetadata = await getNFTTokenMetadata(address, tokenId);

  if (nftTokenMetadata == null || nftTokenMetadata.title == null || nftTokenMetadata.media == null) {
    // TODO: show default image if media is null
    console.warn("No NFT metadata available for the address, %s", address);
    return nft;
  }

  nft.tokenMetadata = {
    title: nftTokenMetadata.title!,
    rawMedia: nftTokenMetadata.media[0].raw!,
    externalUrl: nftTokenMetadata.rawMetadata?.external_url!
  }
  
  // Fetch contract metadata
  const contractMetadata = await getContractMetadata(address);
  
  if (contractMetadata != null && contractMetadata.name == null) {
    console.warn("No contract metadata available for the address, %s", address);
    return nft;
  }

  nft.contractMetadata = {
    name: contractMetadata.name!,
    symbol: contractMetadata.symbol!,
  }

  return nft;
}

export async function getAllOwnedNFT() : Promise<NFT[]> {
    const nftList = await getNFTs("0xf5fff32cf83a1a614e15f25ce55b0c0a6b5f8f2c");
    const nftPromises = nftList.map(nft => getNFTMetadata(nft.contract.address, nft.tokenId));
    
    return await Promise.all(nftPromises);
}
