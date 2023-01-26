"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRedPacketTxStatus = exports.insertRedPacketClaim = exports.UPDATE_REDPACKET_CLAIM_TX = void 0;
const core_1 = require("@urql/core");
const client = (0, core_1.createClient)({
    url: process.env.VITE_HASURA_URL,
    fetchOptions: () => {
        return {
            headers: { "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET },
        };
    },
});
const INSERT_REDPACKET_CLAIM = (0, core_1.gql) `
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
`;
exports.UPDATE_REDPACKET_CLAIM_TX = (0, core_1.gql) `
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
`;
async function insertRedPacketClaim(data) {
    const result = await client.mutation(INSERT_REDPACKET_CLAIM, {
        objects: data.map((d) => ({
            redpacket_id: d.redPacketId,
            claimer_id: d.claimerId,
            creator_id: d.creatorId,
            tx: d.tx,
            tx_status: d.txStatus || "",
            claimer: d.claimer || "",
            claimed: d.claimed || "",
        })),
    }).toPromise();
    return result.data.insert_redpacket_claim.returning;
}
exports.insertRedPacketClaim = insertRedPacketClaim;
async function updateRedPacketTxStatus(id, txStatus, claimed) {
    const result = await client.mutation(exports.UPDATE_REDPACKET_CLAIM_TX, { id, txStatus, claimed }).toPromise();
    return result.data.update_redpacket_claim_by_pk.returning;
}
exports.updateRedPacketTxStatus = updateRedPacketTxStatus;
//# sourceMappingURL=redpacket.js.map