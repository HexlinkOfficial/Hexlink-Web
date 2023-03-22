import { gql } from '@urql/core';
import { useAuthStore } from '@/stores/auth';
import { handleUrqlResponse, setUrqlClientIfNecessary } from './urql';
import { useChainStore } from '@/stores/chain';
import type { Op } from "@/types";

export const GET_ONE_OP = gql`
    query GetOpStatus (
        $id: Int!,
    ) {
        operation_by_pk (id: $id) {
            id
            type
            created_at
            tx_error
            transaction {
              tx
              status
              error
            }
        }
    }
`

export async function getOpStatus(opId: number) : Promise<Op> {
    const client = await setUrqlClientIfNecessary(
      useAuthStore().user?.idToken!
    );
    const result = await client.query(
      GET_ONE_OP,
      {id: opId}
    ).toPromise();
    if (await handleUrqlResponse(result)) {
      const resp = result.data.operation_by_pk;
      return {
        id: opId,
        createdAt: new Date(resp.created_at),
        type: resp.type,
        tx: resp.transaction?.tx,
        txStatus: resp.transaction?.status,
        error: resp.tx_error || resp.transaction?.error,
      }
    } else {
      return await getOpStatus(opId);
    }
}

export const GET_CLAIMED_BY_OP = gql`
    query GetOpStatus (
        $id: Int!,
    ) {
        operation_by_pk (id: $id) {
            id
            redpacket_claims {
              id,
              created_at,
              claimed,
            }
        }
    }
`

export async function getClaimByOp(opId: number) : Promise<{
  id: number,
  claim: {id: number, claimed: string, createdAt: Date} | undefined
}> {
  const client = await setUrqlClientIfNecessary(
    useAuthStore().user!.idToken!
  );
  const result = await client.query(
    GET_CLAIMED_BY_OP,
    {id: opId}
  ).toPromise();
  if (await handleUrqlResponse(result)) {
    const resp = result.data.operation_by_pk;
    const claims = resp.redpacket_claims || [];
    return {
      id: opId,
      claim: claims.length == 0
        ? undefined
        : {
          id: claims[0].id,
          createdAt: new Date(claims[0].created_at),
          claimed: claims[0].claimed.toString(),
        }
    }
  } else {
    return await getOpStatus(opId);
  }
}