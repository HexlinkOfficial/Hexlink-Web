import { gql } from '@urql/core';
import { useAuthStore } from '@/stores/auth';
import { handleUrqlResponse, setUrqlClientIfNecessary } from './urql';
import type { HexlinkUserInfo, RedPacketDB } from "@/types";
import { BigNumber as EthBigNumber } from "ethers";
import { useChainStore } from '@/stores/chain';
import type { ClaimRedPacketOp, RedPacketClaim } from "@/types";

export const GET_REDPACKET_CLAIMS = gql`
    query GetClaimsByRedPacket($redPacketId: String!) {
        redpacket_claim (
            where: {
                redpacket_id: { _eq: $redPacketId },
            },
            limit: 100
        ) {
            id
            claimer
            created_at
            claimed
        }
    }
`

export const GET_REDPACKET_CLAIMS_BY_CLAIMER = gql`
  query GetClaimsByClaimer (
    $userId: String!,
    $chain: String!,
  ) {
    operation (
        where: {
          user_id: { _eq: $userId },
          chain: { _eq: $chain },
          type: { _eq: "claim_redpacket" },
        },
        limit: 100
    ) {
        id
        type
        created_at
        transaction {
          tx
          status
          error
        }
        redpacket_claims {
          id,
          created_at,
          claimed,
          redpacket {
            id,
            creator,
            metadata,
            created_at
          }
        }
    }
  }
`

function parseClaims(claims: any[]) {
  const claim = claims.length > 0 ? claims[0] : undefined;
  if (claim) {
    return {
      claim: {
        claimer: JSON.parse(claim.claimer) as HexlinkUserInfo,
        createdAt: new Date(claim.created_at),
        claimed: claim.claimed ? EthBigNumber.from(claim.claimed) : undefined,
      },
      redpacket: {
        id: claim.redpacket.id,
        metadata: JSON.parse(claim.redpacket.metadata),
        creator: JSON.parse(claim.redpacket.creator),
        createdAt: claim.redpacket.created_at
      } as RedPacketDB,
    }
  }
}

export async function getClaimedRedPackets() : Promise<ClaimRedPacketOp[]> {
  const client = setUrqlClientIfNecessary(
    useAuthStore().user!.idToken!
  );
  const result = await client.query(
    GET_REDPACKET_CLAIMS_BY_CLAIMER,
    {
      userId: useAuthStore().user!.uid,
      chain: useChainStore().chain.name
    }
  ).toPromise();
  if (await handleUrqlResponse(result)) {
    return result.data.operation.map((op : any) => {
      const parsed = parseClaims(op.redpacket_claims || []);
      return {
        id: op.id,
        type: op.type,
        createdAt: new Date(op.created_at),
        claim: parsed?.claim,
        redpacket: parsed?.redpacket,
        tx: op.transaction?.tx,
        txStatus: op.transaction?.status,
        error: op.tx_error || op.transaction?.error,
      };
    });
  } else {
    return await getClaimedRedPackets();
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
    return result.data.redpacket_claim.map((claim : any) => ({
        createdAt: claim.createdAt,
        claimer: JSON.parse(claim.claimer),
        claimed: EthBigNumber.from(claim.claimed),
    }));
  } else {
    return await getRedPacketClaims(redPacketId);
  }
}