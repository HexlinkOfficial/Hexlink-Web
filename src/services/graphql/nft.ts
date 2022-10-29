import type { IUser } from '@/stores/auth'
import { gql } from '@urql/core'
import { setUrqlClientIfNecessary } from './urql'

export const GET_NFT_FOR_USER = gql`
  query GetNFT ($userId: String!) {
    nft (
      where: {
        user_id: { _eq: $userId }
      }
    ) {
      id
      collection_address
      token_id
      nft_raw_url
      nft_title
      nft_description
      collection_name
      collection_symbol
      nft_external_url
    }
  }
`

export const QUERY_NFT = gql`
  query GetNFT (
    $userId: String!
    $collectionAddress: String!
    $tokenId: String!
  ) {
    nft (
      where: {
        user_id: { _eq: $userId },
        collection_address: { _eq: $collectionAddress },
        token_id: { _eq: $tokenId }
      }
    ) {
      id
      collection_address
      token_id
    }
  }
`

export const INSERT_NFT = gql`
  mutation ($objects: [nft_insert_input!]!) {
    insert_nft (
      objects: $objects
    ) {
      affected_rows
      returning {
        id
        collection_address
        token_id
      }
    }
  }
`

export interface NFTInterface {
  collection_address: string;
  token_id: string;
  nft_raw_url: string;
  nft_title?: string;
  nft_description?: string;
  collection_name?: string;
  collection_symbol?: string
  nft_external_url?: string
}

export interface NFTOutput extends NFTInterface {
  id: number;
}

export async function getNFTForUser(
  user: IUser,
  idToken: string
) : Promise<NFTOutput[]>  {
  const client = setUrqlClientIfNecessary(idToken)
  const result = await client.query(
    GET_NFT_FOR_USER,
    {userId: user.uid}
  ).toPromise();
  if (result?.data == undefined) {
    console.log(result);
    throw new Error("Failed to get nft for user");
  }  
return result.data.nft;
}

export async function queryNFT(
  user: IUser,
  collectionAddress: string,
  tokenId: string,
  idToken: string
) : Promise<NFTOutput[]>  {
  const client = setUrqlClientIfNecessary(idToken)
  const result = await client.query(
    QUERY_NFT,
    {userId: user.uid, collectionAddress: collectionAddress, tokenId: tokenId}
  ).toPromise();
  if (result?.data == undefined) {
    console.log("There is no matched nft in the table.");
    return [];
  }
return result.data.nft;
}

export async function saveNFTForUser(
  user: IUser,
  idToken: string,
  data: NFTInterface[]
) {
  const client = setUrqlClientIfNecessary(idToken)
  const result = await client.mutation(
    INSERT_NFT,
    {
      objects: data.map(d => ({
        user_id: user.uid,
        collection_address: d.collection_address,
        token_id: d.token_id,
        nft_raw_url: d.nft_raw_url,
        nft_title: d.nft_title,
        nft_description: d.nft_description,
        collection_name: d.collection_name,
        collection_symbol: d.collection_symbol,
        nft_external_url: d.nft_external_url
      }))
    }
  ).toPromise();
  if (result?.data == undefined) {
    console.log(result);
    throw new Error("Failed to save nft for user");
  }
  return result.data?.save_nft_for_user?.returning;
}