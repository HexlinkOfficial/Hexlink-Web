import { gql } from '@urql/core';
import { useAuthStore } from '@/stores/auth';
import { handleUrqlResponse, setUrqlClientIfNecessary } from './urql';
import type { HexlinkUserInfo, RedPacketDB } from "@/types";
import { userInfo } from "@/web3/account";

export const GET_REDPACKET_CLAIM = gql`
    query GetRedPacketByRedPacket(
        $redpacketId: String!,
        $claimerId: String!,
    ) {
        redpacket_claim (
            where: {
                redpacket_id: { _eq: $redpacketId },
                claimer_id: { _eq: $claimerId },
            }
        ) {
            id
            tx
            created_at
        }
    }
`

export const GET_REDPACKET_CLAIMS = gql`
    query GetClaimsByRedPacket($redpacketId: String!) {
        redpacket_claim (
            where: {
                redpacket_id: { _eq: $redpacketId },
            },
            limit: 100
        ) {
            id
            redpacket_id
            claimer
            claimer_id
            tx
            created_at
            creator_id
        }
    }
`

export const GET_REDPACKET_CLAIMS_BY_CLAIMER = gql`
    query GetClaimsByClaimer($claimerId: String!) {
        redpacket_claim (
            where: {
                claimer_id: { _eq: $claimerId },
            }
        ) {
            id
            claimer
            claimer_id
            tx
            created_at
            creator_id
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

export const INSERT_REDPACKET_CLAIM = gql`
    mutation ($objects: [redpacket_claim_insert_input!]!) {
        insert_redpacket_claim (
            objects: $objects
        ) {
            affected_rows
            returning {
                id
            }
        }
    }
`

export const UPDATE_REDPACKET_CLAIM = gql`
    mutation (
        $id: Int!
        $claimer: jsonb!
    ) {
        update_redpacket_claim_by_pk (
            pk_columns: {id: $id},
            _set: { claimer: $claimer }
        ) {
            id
        }
    }
`

export interface RedPacketClaimInput {
  redPacketId: string,
  creatorId: string,
  tx: string,
}

export interface RedPacketClaim extends RedPacketClaimInput {
  createdAt: Date,
  id: string,
  claimerId: string,
  claimer: HexlinkUserInfo,
}

function parseRedPacketClaim(claim: any) {
  return {
    id: claim.id,
    claimerId: claim.claimer_id,
    claimer: JSON.parse(claim.claimer) as HexlinkUserInfo,
    tx: claim.tx,
    creatorId: claim.creator_id,
    redPacketId: claim.redpacket_id,
    createdAt: new Date(claim.createdAt),
  };
}

export interface ClaimedRedPacket {
  id: string,
  claimerId: string,
  claimer: HexlinkUserInfo,
  creatorId: string,
  tx: string,
  createdAt: Date,
  redPacket: RedPacketDB
}

function parseClaimedRedPacket(claim: any) {
  return {
    id: claim.id,
    claimerId: claim.claimer_id,
    claimer: JSON.parse(claim.claimer) as HexlinkUserInfo,
    tx: claim.tx,
    creatorId: claim.creator_id,
    createdAt: new Date(claim.created_at),
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
    { claimerId: useAuthStore().user!.uid }
  ).toPromise();
  if (await handleUrqlResponse(result)) {
    console.log(result);
    return result.data.redpacket_claim.map((r : any) => {
      return parseClaimedRedPacket(r);
    });
  } else {
    return await getClaimedRedPackets();
  }
}

export async function insertRedPacketClaim(
  data: RedPacketClaimInput[],
) : Promise<{id: string}[]> {
  const client = setUrqlClientIfNecessary(useAuthStore().user!.idToken!)
  const result = await client.mutation(
      INSERT_REDPACKET_CLAIM,
      {
          objects: data.map(d => ({
              redpacket_id: d.redPacketId,
              claimer_id: useAuthStore().user!.uid,
              claimer: userInfo(),
              creator_id: d.creatorId,
              tx: d.tx
          }))
      }
  ).toPromise();
  if (await handleUrqlResponse(result)) {
      return result.data.insert_redpacket_claim.returning;
  } else {
      return await insertRedPacketClaim(data);
  }
}

export async function updateRedPacketClaimer(
  id: number,
  claimer: HexlinkUserInfo
) : Promise<void> {
  const client = setUrqlClientIfNecessary(
    useAuthStore().user!.idToken!
  );
  const result = await client.mutation(
      UPDATE_REDPACKET_CLAIM,
      {id, claimer: JSON.stringify(claimer)}
  ).toPromise();
  if (!await handleUrqlResponse(result)) {
      await updateRedPacketClaimer(id, claimer);
  }
}