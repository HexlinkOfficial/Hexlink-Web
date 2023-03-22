import { gql } from '@urql/core';
import { useAuthStore } from '@/stores/auth';
import { handleUrqlResponse, setUrqlClientIfNecessary } from './urql';
import type { RedPacketDB } from "@/types";
import { BigNumber as EthBigNumber } from "ethers";
import { useChainStore } from '@/stores/chain';
import type { ClaimRedPacketOp, RedPacketClaim } from "@/types";
import {getRedPacket} from "./redpacket";

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
        request
        created_at
        tx_error
        transaction {
          tx
          status
          error
        }
        redpacket_claims {
          id,
          created_at,
          claimed,
          redpacket_public {
            id,
            creator,
            metadata,
            type,
            created_at
          }
        }
        request {
          args
        }
    }
  }
`

async function parseClaims(op: any) {
  const claim = (op.redpacket_claims || []).length > 0
    ? op.redpacket_claims[0]
    : undefined;
  if (claim) {
    return {
      claim: {
        createdAt: new Date(claim.created_at),
        claimed: claim.claimed,
      },
      redpacket: {
        id: claim.redpacket_public.id,
        metadata: JSON.parse(claim.redpacket_public.metadata),
        creator: JSON.parse(claim.redpacket_public.creator),
        createdAt: claim.redpacket_public.created_at,
        type: claim.redpacket_public.type,
      } as RedPacketDB,
    }
  } else if (op.request?.args) {
    const {redPacketId} = JSON.parse(op.request.args);
    const redpacket = await getRedPacket(redPacketId);
    return {
      claim: {
        createdAt: new Date(op.created_at),
      },
      redpacket: {
        id: redPacketId,
        metadata: redpacket!.metadata,
        creator: redpacket!.creator,
        createdAt: new Date(op.created_at),
        type: redpacket!.type,
      }
    }
  }
}

export async function getClaimedRedPackets() : Promise<ClaimRedPacketOp[]> {
  const client = await setUrqlClientIfNecessary(
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
    return await Promise.all(
      result.data.operation.map(async (op : any) => {
        const parsed = await parseClaims(op);
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
      })
    );
  } else {
    return await getClaimedRedPackets();
  }
}

export async function getRedPacketClaims(
  redPacketId: string
) : Promise<RedPacketClaim[]> {
  const client = await setUrqlClientIfNecessary(
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