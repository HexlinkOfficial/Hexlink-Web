import { gql } from '@urql/core';
import { useAuthStore } from '@/stores/auth';
import { handleUrqlResponse, createUrqlClient } from './urql';
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
    const client = createUrqlClient(
      useAuthStore().user!.idToken,
      'cache-and-network'
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