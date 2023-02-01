import { gql } from '@urql/core';
import { useAuthStore } from '@/stores/auth';
import { handleUrqlResponse, setUrqlClientIfNecessary } from './urql';
import type { HexlinkUserInfo, RedPacketDB } from "@/types";
import { BigNumber as EthBigNumber } from "ethers";
import { useChainStore } from '@/stores/chain';
import type {
  RedPacketClaim,
  ClaimedRedPacket,
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
            op_error
            operation {
              tx_error
              transaction {
                chain
                tx
                status
                created_at
                updated_at
                error
              }
            }
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
            op_error
            operation {
              tx_error
              transaction {
                chain
                tx
                status
                created_at
                updated_at
                error
              }
            }
        }
    }
  `

function buildTxState(claim: any) {
  if (claim.op_error) {
    return {error: claim.op_error};
  }
  const op = claim.operation;
  if (!op) {
    return undefined;
  }

  if (op.tx_error) {
    return {error: op.tx_error};
  }
  const tx = op.transaction;
  if (tx) {
    return { 
      chain: tx.chain,
      tx: tx.tx,
      status: tx.status,
      updatedAt: new Date(tx.updatedAt),
      createdAt: new Date(tx.updatedAt),
      error: claim.op_error || claim.operation?.tx_error || tx.error
    }
  }
  return undefined;
}

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
    txState: buildTxState(claim),
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
      txState: buildTxState(claim),
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