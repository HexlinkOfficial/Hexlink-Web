import { BigNumber, BigNumberish } from 'ethers'
import {
  Account,
  Account__factory,
  Hexlink,
  Hexlink__factory,
} from '@hexlink/contracts'

import { hexConcat } from 'ethers/lib/utils'
import { BaseApiParams, BaseAccountAPI } from './BaseAccountAPI'
import { genSignature } from '../services/auth'
import { getAccountAddress } from '../web3/account'

/**
 * constructor params, added no top of base params:
 * @param ownerAddress the address for the account owner
 * @param factoryAddress address of contract "factory" to deploy new contracts (not needed if account already deployed)
 */
export interface HexlinkAccountApiParams extends BaseApiParams {
  factoryAddress?: string;
  name: string;
  nameType: string;
}

/**
 * An implementation of the BaseAccountAPI using the Hexlink Account contract.
 */
export class HexlinkAccountAPI extends BaseAccountAPI {
  factoryAddress?: string

  /**
   * our account contract.
   */
  accountContract?: Account
  factory?: Hexlink
  nameType: string;
  name: string;

  constructor (params: HexlinkAccountApiParams) {
    super(params)
    this.factoryAddress = params.factoryAddress;
    this.nameType = params.nameType;
    this.name = params.name
  }

  async _getAccountContract (): Promise<Account> {
    if (this.accountContract == null) {
      this.accountContract = Account__factory.connect(
        await this.getAccountAddress(),
        this.provider
      );
    }
    return this.accountContract
  }

  /**
   * return the value to put into the "initCode" field, if the account is not yet deployed.
   * this value holds the Hexlink contract address, followed by this account's information
   */
  async getAccountInitCode(): Promise<string> {
    if (this.factory == null) {
      if (this.factoryAddress != null && this.factoryAddress !== '') {
        this.factory = Hexlink__factory.connect(this.factoryAddress, this.provider)
      } else {
        throw new Error('no factory to get initCode')
      }
    }
    const data = this.factory.interface.encodeFunctionData(
      'deploy', [this.nameType, this.name]);
    return hexConcat([this.factory.address, data])
  }

  async getNonce (): Promise<BigNumber> {
    if (await this.checkAccountPhantom()) {
      return BigNumber.from(0)
    }
    const accountContract = await this._getAccountContract()
    return await accountContract.getNonce()
  }

  /**
   * encode a method call from entryPoint to our contract
   * @param target
   * @param value
   * @param data
   */
  async encodeExecute (target: string, value: BigNumberish, data: string): Promise<string> {
    const accountContract = await this._getAccountContract()
    return accountContract.interface.encodeFunctionData(
      "execute",
      [{target, value, data}])
  }

  async signUserOpHash (userOpHash: string): Promise<string> {
    return await genSignature(this.name, userOpHash)
  }

  async getAccountAddress (): Promise<string> {
    return getAccountAddress()
  }
}