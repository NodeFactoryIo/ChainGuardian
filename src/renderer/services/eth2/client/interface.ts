import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {ILogger} from "@chainsafe/lodestar-utils";
import {IApiClient} from "@chainsafe/lodestar-validator/lib";
import {IBeaconApi, IBeaconBlocksApi, IBeaconStateApi} from "@chainsafe/lodestar-validator/lib/api/interface/beacon";
import {INodeApi} from "@chainsafe/lodestar-validator/lib/api/interface/node";
import {IValidatorApi} from "@chainsafe/lodestar-validator/lib/api/interface/validators";
import {
    BLSPubkey,
    SignedBeaconBlock,
    ValidatorIndex,
    ValidatorResponse,
    ValidatorStatus,
} from "@chainsafe/lodestar-types";

export interface ICGETH2BeaconBlocksApi extends IBeaconBlocksApi {
    getBlock(blockId: "head" | "genesis" | "finalized" | number): Promise<SignedBeaconBlock>;
}

// extend all known statuses can get from different beacon nodes vendors
enum CgValidatorStatus {
    UNKNOWN = "unknown",
    WITHDRAWABLE = "withdrawable",
    WITHDRAWNED = "withdrawned",
}

export interface ICGValidatorResponse extends Omit<ValidatorResponse, "status"> {
    status: CgValidatorStatus & ValidatorStatus;
}

export interface ICGBeaconStateApi extends Omit<IBeaconStateApi, "getStateValidator"> {
    getStateValidator(stateId: "head", validatorId: ValidatorIndex | BLSPubkey): Promise<ICGValidatorResponse | null>;
}

export interface ICGEth2BeaconApi extends Omit<IBeaconApi, "blocks" | "state"> {
    blocks: ICGETH2BeaconBlocksApi;
    state: ICGBeaconStateApi;
}

export type ICGEth2NodeApi = INodeApi;
export type ICGEth2ValidatorApi = IValidatorApi;

export type DepositContract = {
    data: {
        // eslint-disable-next-line camelcase
        chain_id: string;
        address: string;
    };
};
export interface ICGEth2Config {
    getDepositContract(): Promise<DepositContract["data"]>;
}

/**
 * Extends minimal interface(IApiClient) required by lodestar validator
 */
export interface ICgEth2ApiClient extends Omit<IApiClient, "beacon" | "validator" | "node"> {
    beacon: ICGEth2BeaconApi;
    validator: ICGEth2ValidatorApi;
    node: ICGEth2NodeApi;
    networkConfig: ICGEth2Config;
}

export type IValidatorBeaconClient = IApiClient;

export interface IBeaconClientOptions {
    // Add more options if needed
    baseUrl: string;
    logger: ILogger;
    config: IBeaconConfig;
}
