import { gql } from '@urql/core';
import { useAuthStore } from '@/stores/auth';
import { handleUrqlResponse, setUrqlClientIfNecessary } from './urql';
import type { HexlinkUserInfo, RedPacketDB } from "@/types";
import { BigNumber as EthBigNumber } from "ethers";
import { useChainStore } from '@/stores/chain';
import type {
  RedPacketClaim,
  ClaimedRedPacket,
  TxStatus,
} from "@/types";

export const GET_REDPACKET_CLAIM = gql`
    query GetRedPacketByRedPacket(
        $redPacketId: String!,
        $claimerId: String!,
    ) {
        redpacket_claim (
            where: {
                redpacket_id: { _eq: $redPacketId },
                claimer_id: { _eq: $claimerId },
            }
        ) {
            id
            tx
            created_at
            tx_status
            claimed
        }
    }
`

export const GET_REDPACKET_CLAIMS = gql`
    query GetClaimsByRedPacket($redPacketId: String!) {
        redpacket_claim (
            where: {
                redpacket_id: { _eq: $redPacketId },
                tx_status: { _eq: "success" }
            },
            limit: 100
        ) {
            id
            redpacket_id
            claimer
            claimer_id
            tx
            created_at
            tx_status
            claimed
        }
    }
`

export const GET_REDPACKET_CLAIMS_BY_CLAIMER = gql`
    query GetClaimsByClaimer(
        $claimerId: String!
        $chain: String!
    ) {
        redpacket_claim (
            where: {
                claimer_id: { _eq: $claimerId },
                redpacket: { chain: { _eq: $chain }}
            }
        ) {
            id
            claimer
            claimer_id
            tx
            created_at
            tx_status
            claimed
            redpacket {
              id
              user_id
              chain
              metadata
              creator
              created_at
            }
        }
    }
  `

export const UPDATE_REDPACKET_CLAIM_TX = gql`
    mutation (
        $id: Int!
        $txStatus: String!
        $claimed: String
    ) {
        update_redpacket_claim_by_pk (
            pk_columns: {id: $id},
            _set: {
              tx_status: $txStatus,
              claimed: $claimed,
            }
        ) {
            id
        }
    }
`

function parseRedPacketClaim(claim: any) : RedPacketClaim {
  return {
    id: claim.id,
    claimerId: claim.claimer_id,
    claimer: JSON.parse(claim.claimer) as HexlinkUserInfo,
    tx: claim.tx,
    redPacketId: claim.redpacket_id,
    createdAt: new Date(claim.createdAt),
    txStatus: claim.tx_status,
    claimed: claim.claimed,
  } as RedPacketClaim;
}

function parseClaimedRedPacket(claim: any) {
  return {
    claim: {
      id: claim.id,
      claimerId: claim.claimer_id,
      claimer: JSON.parse(claim.claimer) as HexlinkUserInfo,
      tx: claim.tx,
      createdAt: new Date(claim.created_at),
      redPacketId: claim.redpacket.id,
      txStatus: claim.tx_status,
      claimed: claim.claimed ? EthBigNumber.from(claim.claimed) : undefined,
    },
    redPacket: {
      id: claim.redpacket.id,
      userId: claim.redpacket.user_id,
      chain: claim.redpacket.chain,
      metadata: JSON.parse(claim.redpacket.metadata),
      creator: JSON.parse(claim.redpacket.creator),
      createdAt: claim.redpacket.created_at
    } as RedPacketDB
  };
}

export async function isClaimed(
  redPacketId: string,
  claimerId: string,
) : Promise<boolean> {
  const client = setUrqlClientIfNecessary(
    useAuthStore().user!.idToken!
  );
  const result = await client.query(
    GET_REDPACKET_CLAIM,
    {redPacketId, claimerId}
  ).toPromise();
  if (await handleUrqlResponse(result)) {
    return result.data.redpacket_claim.length > 0;
  } else {
    return await isClaimed(redPacketId, claimerId);
  }
}

export async function getRedPacketClaims(
  redPacketId: string
) : Promise<RedPacketClaim[]> {
  const client = setUrqlClientIfNecessary(
    useAuthStore().user!.idToken!
  );
  const result = await client.query(
    GET_REDPACKET_CLAIMS,
    {redPacketId}
  ).toPromise();
  if (await handleUrqlResponse(result)) {
    return result.data.redpacket_claim.map((r : any) => {
      return parseRedPacketClaim(r);
    });
  } else {
    return await getRedPacketClaims(redPacketId);
  }
}

export async function getClaimedRedPackets() : Promise<ClaimedRedPacket[]> {
  const client = setUrqlClientIfNecessary(
    useAuthStore().user!.idToken!
  );
  const result = await client.query(
    GET_REDPACKET_CLAIMS_BY_CLAIMER,
    {
      claimerId: useAuthStore().user!.uid,
      chain: useChainStore().chain.name
    }
  ).toPromise();
  if (await handleUrqlResponse(result)) {
    return result.data.redpacket_claim.map((r : any) => {
      return parseClaimedRedPacket(r);
    });
  } else {
    return await getClaimedRedPackets();
  }
}

export async function updateRedPacketTxStatus(
  id: number,
  txStatus: TxStatus,
  claimed?: string
) : Promise<void> {
  const client = setUrqlClientIfNecessary(
    useAuthStore().user!.idToken!
  );
  const result = await client.mutation(
      UPDATE_REDPACKET_CLAIM_TX,
      {id, txStatus, claimed}
  ).toPromise();
  if (!await handleUrqlResponse(result)) {
      await updateRedPacketTxStatus(id, txStatus, claimed);
  }
}