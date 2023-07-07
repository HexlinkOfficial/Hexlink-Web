
import { useChainStore } from "@/stores/chain";
import { UserOperationStruct } from "@account-abstraction/contracts";
import { ethers } from "ethers";
import { BigNumber as EthBigNumber } from "ethers";
import { getAccountAddress, getName, getNameType, getNonce, isContract } from "./account";
import { buildAccountExecData } from "./account";
import ERC20_ABI from "../abi/ERC20_ABI.json";
import { genSignature } from "@/services/auth";
import { HexlinkAccountAPI } from "@/accountAPI/HexlinkAccountAPI";
import { DUMMY_SIGNATURE, ENTRYPOINT } from "./constants";
import { hash } from "./utils";
import { hexlify } from "ethers/lib/utils"

const erc20Interface = new ethers.utils.Interface(ERC20_ABI);

const buildCallData = (token: string, to: string, amount: EthBigNumber) => {
    if (token == ethers.constants.AddressZero) {
      return buildAccountExecData(to, amount, []);
    } else {
      const erc20Data = erc20Interface.encodeFunctionData(
        "transfer", [to, amount]
      );
      return buildAccountExecData(token, 0, erc20Data);
    }
  }

function genValidationData() : EthBigNumber {
  const now = Math.floor(Date.now() / 1000) - 60;
  return EthBigNumber.from(now + 1800).shl(160).add(
    EthBigNumber.from(now).shl(208)
  );
}

export const buildTokenTransferUserOp = async (
    tx: {token: string, to: string, amount: EthBigNumber},
    api: HexlinkAccountAPI,
  ) : Promise<Partial<UserOperationStruct>> => {
    const sender = await getAccountAddress();
    let nonce : EthBigNumber = EthBigNumber.from(0);
    let initCode = "0x";
    if (await isContract(sender)) {
      nonce = await getNonce(api.entryPointAddress, sender);
    } else {
      initCode = await api.getInitCode();
    }
    const gasInfo = await api.provider.getFeeData();
    const authInput = ethers.utils.defaultAbiCoder.encode(
      ["tuple(uint256, address, bytes)"],
      [[0, ethers.constants.AddressZero, DUMMY_SIGNATURE]]
    );
    return {
        sender,
        nonce: hexlify(nonce),
        initCode,
        callData: buildCallData(tx.token, tx.to, tx.amount),
        callGasLimit: hexlify(2000000),
        verificationGasLimit: hexlify(2000000),
        maxFeePerGas: hexlify(gasInfo.maxFeePerGas ?? 0),
        maxPriorityFeePerGas: hexlify(gasInfo.maxPriorityFeePerGas ?? 0),
        preVerificationGas: hexlify(2000000),
        paymasterAndData: "0x",
        signature: authInput,
    };
  };

export const signUserOp = async(
    userOp: UserOperationStruct,
    otp: string,
    api: HexlinkAccountAPI,
) : Promise<string> => {
    const userOpHash = await genUserOpHash(
      userOp,
      useChainStore().chain.chainId!,
      api.entryPointAddress
    );
    const validationData = genValidationData();
    const toSign = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["uint256", "bytes32"],
        [validationData, userOpHash]
      )
    );
    const result: any = await genSignature(otp, toSign);
    if (result.code === 200) {
      const {signer, signature} = result as any;
      const authInput = ethers.utils.defaultAbiCoder.encode(
        ["tuple(uint256, address, bytes)"],
        [[validationData, signer, signature]]
      );
      return authInput;
    } else if (result.code === 429) {
      throw new Error("Too many attempts. Please wait for five minutes");
    } else {
      console.log(result);
      throw new Error("Failed to sign the user opeeration");
    }
}


export const genUserOpHash = async (
    userOp: UserOperationStruct,
    chainId: string,
    entryPointAddress: string
  ) => {
    const op = await ethers.utils.resolveProperties(userOp);
    const opHash = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        [
          'address',
          'uint256',
          'bytes32',
          'bytes32',
          'uint256',
          'uint256',
          'uint256',
          'uint256',
          'uint256',
          'bytes32',
        ],
        [
          op.sender,
          op.nonce,
          ethers.utils.keccak256(op.initCode),
          ethers.utils.keccak256(op.callData),
          op.callGasLimit,
          op.verificationGasLimit,
          op.preVerificationGas,
          op.maxFeePerGas,
          op.maxPriorityFeePerGas,
          ethers.utils.keccak256(op.paymasterAndData)
        ]
      )
    );
    return ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["bytes32", "address", "uint256"],
        [opHash, entryPointAddress, Number(chainId)]
      )
    );
  }

export const getHexlinkAccountApi = () : HexlinkAccountAPI => {
  return new HexlinkAccountAPI({
    provider: useChainStore().provider,
    entryPointAddress: ENTRYPOINT,
    factoryAddress: import.meta.env.VITE_ACCOUNT_FACTORY_V2,
    paymasterAPI: undefined,
    nameType: hash(getNameType()),
    name: hash(getName()),
  });
}