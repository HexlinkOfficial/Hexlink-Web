import { create } from 'ipfs-http-client'
import { Buffer } from 'buffer'

const projectId = import.meta.env.VITE_INFURA_IPFS_PROJECT_ID
const projectSecret = import.meta.env.VITE_INFURA_IPFS_API_KEY
const auth = 'Basic ' + Buffer.from(projectId + ":" + projectSecret).toString('base64')

const client = () => create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
      authorization: auth,
  }
});

export async function uploadToIPFS(file: File) : Promise<string> {
    const c = client();
    const {cid, path} = await c.add(file);
    await c.pin.add(cid);
    return path;
}

export function ipfsUrl(cid: string) {
    if (import.meta.env.VITE_USE_FUNCTIONS_EMULATOR) {
        return `https://hexlink-dev.infura-ipfs.io/ipfs/${cid}`;
    } else {
        return `https://hexlink.infura-ipfs.io/ipfs/${cid}`;
    }
}