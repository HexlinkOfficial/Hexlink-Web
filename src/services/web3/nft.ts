import type { IAuth } from "@/stores/auth";
import { Network, Alchemy, type Media, type OwnedNft } from "alchemy-sdk";
import { getFunctions, httpsCallable } from "firebase/functions";
import { deleteNFTForUser, getNFTForUser, saveNFTForUser, type NFTInterface, type NFTOutput } from "../graphql/nft";

const functions = getFunctions();

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
  description: string;
  rawMedia: string;
  externalUrl?: string;
}

export interface ContractMetadata {
  name?: string;
  symbol?: string;
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
    
  return nfts.ownedNfts.filter(nft => (nft.title && nft.media));
}

export async function getNFTTokenMetadata(address: string, tokenId: string) {
  return await alchemy.nft.getNftMetadata(address, tokenId);
}

export async function getContractMetadata(address: string) {
  return await alchemy.nft.getContractMetadata(address);
}

export async function getNFTMetadata(address: string, tokenId: string) : Promise<NFTOutput> {  
  let nft = {} as NFTOutput;
  nft.collection_address = address;
  nft.token_id = tokenId;

  // Fetch token metadata for the NFT
  const nftTokenMetadata = await getNFTTokenMetadata(address, tokenId);

  if (nftTokenMetadata == null || nftTokenMetadata.title == null || nftTokenMetadata.media == null) {
    // TODO: show default image if media is null
    console.warn("No NFT metadata available for the address, %s", address);
    return nft;
  }

  nft.nft_title = nftTokenMetadata.title || "Unnamed";
  nft.nft_description = nftTokenMetadata.description;
  nft.nft_raw_url = nftTokenMetadata.media[0]?.raw!;
  nft.nft_external_url = nftTokenMetadata.rawMetadata?.external_url;
  
  // Fetch contract metadata
  const contractMetadata = await getContractMetadata(address);

  if (contractMetadata != null && contractMetadata.name == null) {
    console.warn("No contract metadata available for the address, %s", address);
    return nft;
  }

  nft.collection_name = contractMetadata.name!;
  nft.collection_symbol = contractMetadata.symbol!;

  return nft;
}

export async function getAllOwnedNFT(store: IAuth) : Promise<NFTOutput[]> {
  let nftForUser : NFTOutput[] = [];
  try {
    nftForUser = await getNFTForUser(
      store.currentUser!,
      store.idToken!
    );
  } catch (error) {
    console.log(error);
  }

  if (nftForUser.length == 0) {
    console.log("Initialize NFT list for the user");
    const initializeNFTList = await getNFTs(store.currentUser?.walletAddress!);
    const initializeNFTListPromises = initializeNFTList.map(nft => getNFTMetadata(nft.contract.address, nft.tokenId));
    const initializeNFTListValue = await Promise.all(initializeNFTListPromises);
    let newNFTs : NFTOutput[] = [];
    try {
      newNFTs = await saveNFTForUser(store.currentUser!, store.idToken!, initializeNFTListValue);
    } catch (error) {
      console.log(error);
    }


    return await Promise.all(newNFTs);
  }
    
  return await Promise.all(nftForUser);
}

export async function isHolderOfCollection(owner: string, address: string) : Promise<boolean> {
  return await alchemy.nft.verifyNftOwnership(owner, address);
}

export async function transferNFT(sender: string, receiver: string, collection_address: string, tokenId: string, id: number, idToken: string) {
  const sendERC721 = httpsCallable(functions, 'sendERC721');
  const result = await sendERC721({
    collection_address: collection_address,
    tokenId: tokenId,
    sender: sender,
    receiver: receiver
  });
  const tableUpdateResult = await deleteNFTForUser(idToken, id);
  return result.data as {txHash: string};
}
