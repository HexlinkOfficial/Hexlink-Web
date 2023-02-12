import { create } from 'ipfs-http-client'
import { Buffer } from 'buffer'

const projectId = import.meta.env.VITE_INFURA_IPFS_PORJECT_ID
const projectSecret = import.meta.env.VITE_INFURA_IPFS_API_KEY
const auth = 'Basic ' + Buffer.from(projectId + ":" + projectSecret).toString('base64')

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
      authorization: auth,
  }
});

export async function uploadToIPFS(file: File) {
    const {cid} = await client.add(file);
    await client.pin.add(cid);
    return cid;
}

export function ipfsUrl(cid: string) {
    return `https://hexlink.infura-ipfs.io/ipfs/${cid}`;
}