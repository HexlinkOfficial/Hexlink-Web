"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertRedPacket = exports.insertRedPacketClaim = void 0;
const core_1 = require("@urql/core");
const client_1 = require("./client");
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
async function insertRedPacketClaim(data) {
    const result = await client_1.client.mutation(INSERT_REDPACKET_CLAIM, {
        objects: data.map((d) => {
            var _a;
            return ({
                redpacket_id: d.redPacketId,
                claimer_id: d.claimerId,
                creator_id: d.creatorId,
                claimer: JSON.stringify(d.claimer || {}),
                claimed: ((_a = d.claimed) === null || _a === void 0 ? void 0 : _a.toString()) || "0",
                op_id: d.opId,
            });
        }),
    }).toPromise();
    return result.data.insert_redpacket_claim.returning;
}
exports.insertRedPacketClaim = insertRedPacketClaim;
const INSERT_REDPACKET = (0, core_1.gql) `
    mutation ($objects: [redpacket_insert_input!]!) {
        insert_redpacket (
            objects: $objects
        ) {
            affected_rows
            returning {
                id
            }
        }
    }
`;
async function insertRedPacket(uid, data) {
    const result = await client_1.client.mutation(INSERT_REDPACKET, {
        objects: data.map((d) => ({
            user_id: uid,
            id: d.id,
            metadata: JSON.stringify(d.metadata),
            creator: JSON.stringify(d.creator),
            op_id: d.opId,
            validation_data: JSON.stringify(d.validationData),
            type: d.type,
        })),
    }).toPromise();
    return result.data.insert_redpacket.returning;
}
exports.insertRedPacket = insertRedPacket;
//# sourceMappingURL=redpacket.js.map