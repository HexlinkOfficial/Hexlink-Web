import { BigNumber, BigNumberish } from 'ethers'
import {
  Account,
  Account__factory, Hexlink,
  Hexlink__factory,
} from '@hexlink/contracts'

import { hexConcat } from 'ethers/lib/utils'
import { signMessage } from "../web3/wallet";
import { BaseApiParams, BaseAccountAPI } from './BaseAccountAPI'
import { genDeployAuthProof } from '../web3/oracle'

/**
 * constructor params, added no top of base params:
 * @param ownerAddress the address for the account owner
 * @param factoryAddress address of contract "factory" to deploy new contracts (not needed if account already deployed)
 */
export interface HexlinkAccountApiParams extends BaseApiParams {
  ownerAddress: string
  factoryAddress?: string
}

/**
 * An implementation of the BaseAccountAPI using the Hexlink Account contract.
 */
export class HexlinkAccountAPI extends BaseAccountAPI {
  ownerAddress: string | undefined
  factoryAddress?: string

  /**
   * our account contract.
   */
  accountContract?: Account

  factory?: Hexlink

  name?: any

  constructor (params: HexlinkAccountApiParams) {
    super(params)
    this.factoryAddress = params.factoryAddress
    this.ownerAddress = params.ownerAddress
  }

  async _getAccountContract (): Promise<Account> {
    if (this.accountContract == null) {
      this.accountContract = Account__factory.connect(await this.getAccountAddress(), this.provider)
    }
    return this.accountContract
  }

  /**
   * return the value to put into the "initCode" field, if the account is not yet deployed.
   * this value holds the Hexlink contract address, followed by this account's information
   */
  async getAccountInitCode (): Promise<string> {
    if (this.factory == null) {
      if (this.factoryAddress != null && this.factoryAddress !== '') {
        this.factory = Hexlink__factory.connect(this.factoryAddress, this.provider)
      } else {
        throw new Error('no factory to get initCode')
      }
    }

    const accountContract = await this._getAccountContract()
    if (this.ownerAddress == undefined) {
        throw new Error('the owner account address is null')
    }
    const initData = accountContract.interface.encodeFunctionData('init', [this.ownerAddress])
    const { proof } = await genDeployAuthProof()
    return hexConcat([
      this.factory.address,
      this.factory.interface.encodeFunctionData(
        'deploy',
        [
            // TODO need to figure out how to pass in the name struct
            this.name,
            initData,
            proof,
        ])
    ])
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
      'exec',
      [
        target,
        value,
        data
      ])
  }

  async signUserOpHash (userOpHash: string): Promise<string> {
    if (this.ownerAddress == undefined) {
        throw new Error('the owner account address is null')
    }
    return await signMessage(this.ownerAddress, userOpHash)
  }
}