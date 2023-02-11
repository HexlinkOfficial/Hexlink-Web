/* eslint-disable max-len */
import {ethers} from "ethers";
import type {Signer} from "ethers";

const flatDirectoryAbi = [
  "function write(bytes memory name, bytes memory data) external payable",
  "function read(bytes memory name) external view returns (bytes memory, bool)",
  "function writeChunk(bytes memory name, uint256 chunkId, bytes memory data) external payable",
  "function readChunk(bytes memory name, uint256 chunkId) external view returns (bytes memory, bool)",
];

const bufferChunk = (buffer: Buffer, chunkSize: number) => {
  let i = 0;
  const result = [];
  const len = buffer.length;
  const chunkLength = Math.ceil(len / chunkSize);
  while (i < len) {
    result.push(buffer.subarray(i, i += chunkLength));
  }
  return result;
};

const NftRootStorage = (signer: Signer) => {
  return new ethers.Contract(
    "0x72fb3F7B0A3e0ff3Ee1F488B853A85bdb781e140",
    flatDirectoryAbi,
    signer
  );
};

const readFile = async(url: string) : Promise<Buffer> => {
  return Buffer.from("");
};

export async function writeFile(file: File, signer: Signer) {
  const contract = NftRootStorage(signer);
  const hexName = "0x" + Buffer.from("hello.txt", "utf8").toString("hex");
  const content = await readFile(file.name);

  // Data need to be sliced if file > 475K
  let chunks = [];
  let fileSize = file.size;
  if (fileSize > 475 * 1024) {
    const chunkSize = Math.ceil(fileSize / (475 * 1024));
    chunks = bufferChunk(content, chunkSize);
    fileSize = fileSize / chunkSize;
  } else {
    chunks.push(content);
  }

  // Files larger than 24k need stak tokens
  let cost = 0;
  if (file.size > 24 * 1024 - 326) {
    cost = Math.floor((file.size + 326) / 1024 / 24);
  }

  for (const index of chunks.keys()) {
    const chunk = chunks[index];
    const hexData = "0x" + chunk.toString("hex");

    const estimatedGas = await contract.estimateGas.writeChunk(hexName, index, hexData, {
      value: ethers.utils.parseEther(cost.toString()),
    });

    // upload file
    const option = {
      gasLimit: estimatedGas.mul(6).div(5).toString(),
      value: ethers.utils.parseEther(cost.toString()),
    };
    const tx = await contract.writeChunk(hexName, index, hexData, option);
    console.log(`Transaction Id: ${tx.hash}`);

    // get result
    const receipt = await tx.wait();
    if (receipt.status) {
      console.log(`File ${file.name} chunkId: ${index} uploaded!`);
    }
  }
  console.log(content);
}
