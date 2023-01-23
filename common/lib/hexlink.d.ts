import { ethers, Contract } from "ethers";
import type { Provider } from "@ethersproject/providers";
import { type Chain } from "./chain";
export declare function hexlAddress(chain: Chain): string;
export declare function hexlInterface(): ethers.utils.Interface;
export declare function hexlContract(provider: Provider): Promise<Contract>;
//# sourceMappingURL=hexlink.d.ts.map