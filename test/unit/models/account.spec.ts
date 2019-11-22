import sinon from "sinon";
import {Keypair} from "@chainsafe/bls/lib/keypair";

// Mock keystore, only address is important
// eslint-disable-next-line max-len
const mockKeystore = {"crypto":{"kdf":{"function":"pbkdf2","message":"","params":{"c":262144,"dklen":32,"prf":"hmac-sha256","salt":"d6789f160795e07b4383a930f6904513149ce806183f8598a1e077eff7b244e8"}},"checksum":{"function":"sha256","message":"4b03b8f270ffb22c060717c268a9cb17d8e2711deaa1ff21cc881455b594e31d","params":{}},"cipher":{"function":"aes-128-ctr","message":"f66b216f3cfbe4836d0889f5c5b28fdcbe6d97fdad45d362571aec62bc76f6fd","params":{"iv":"b605a33cf3086ca3aa42e77a22fbdbfd"}}},"pubkey":"a12c862a5c295b665989ac905231767d752df00fbad33378a83fa2c4acfdffa04d2ee8f9aa9ba5406ea5f35c2825b136","path":"m/12381/60/0/0","uuid":"456f6a72-33ed-47c0-9206-09f432eec7d2","version":4};

const mockedReadDirSync = sinon
    .stub()
    .withArgs("/test_keystores/")
    .returns(["keystore1.json", "keystore2.json", "keystoreNotJSONError"]);
const mockedExistSync = sinon
    .stub()
    .withArgs("/test_keystores/keystore1.json")
    .returns(true)
    .withArgs("/test_keystores/keystore2.json")
    .returns(true);
const mockedReadFileSync = sinon
    .stub()
    .withArgs("/test_keystores/keystore1.json")
    .returns(JSON.stringify(mockKeystore))
    .withArgs("/test_keystores/keystore2.json")
    .returns(JSON.stringify(mockKeystore));

jest.mock("fs", () => ({
    readdirSync: mockedReadDirSync,
    existsSync: mockedExistSync,
    readFileSync: mockedReadFileSync
}));

import {CGAccount} from "../../../src/renderer/models/account";
import {EthKeystoreFactory} from "../../../src/renderer/services/keystore";
// Passwords for keystores 1 & 2
const PRIMARY_KEYSTORE_PASSWORD = "chainGuardianPass";


function createTestAccount(): CGAccount {
    return new CGAccount({
        name: "Test Account",
        directory: "/test_keystores/",
        sendStats: false
    });
}


describe("CGAccount tests", () => {

    let sandbox: sinon.SinonSandbox;
    beforeEach(() => {

        sandbox = sinon.createSandbox();
        sandbox
            .stub(EthKeystoreFactory.prototype, "getAddress")
            .returns("0x001");
        sandbox
            .stub(EthKeystoreFactory.prototype, "decrypt")
            .callsFake(function(password: string) {
                if (password === PRIMARY_KEYSTORE_PASSWORD) {
                    return Keypair.generate();
                } else {
                    throw new Error("Incorrect password");
                }
            });
    });

    afterEach(() => {
        sandbox.restore();
    });
    it("should be able to get validator addresses from keystores", async () => {
        const account = createTestAccount();
        await account.unlock(PRIMARY_KEYSTORE_PASSWORD);
        const validatorsAddresses = account.getValidatorsAddresses();
        account.lock();
        expect(validatorsAddresses.length).toEqual(2);
    });

    it("should be able to get validator keypairs if the account is unlocked", async () => {
        const account = createTestAccount();

        await account.unlock(PRIMARY_KEYSTORE_PASSWORD);
        const validatorKeypairs = account.getValidators();

        expect(validatorKeypairs.length).toEqual(2);

        account.lock();

        expect(() => {
            account.getValidators();
        }).toThrowError();
    });

    it("should not be able to get validator keypairs if the account is locked", () => {
        const account = createTestAccount();

        expect(() => {
            account.getValidators();
        }).toThrowError();
    });

    it("should be able to lock account", async () => {
        const account = createTestAccount();

        await account.unlock(PRIMARY_KEYSTORE_PASSWORD);
        account.lock();
        expect(() => {
            account.getValidators();
        }).toThrowError();
    });

    it("should not be able to unlock with wrong password", async () => {
        const account = createTestAccount();

        await account.unlock("wrongPassword");

        expect(() => {
            account.getValidators();
        }).toThrowError();
    });

    it("should be able to verify correct password", () => {
        const account = createTestAccount();

        expect(account.isCorrectPassword(PRIMARY_KEYSTORE_PASSWORD)).toEqual(true);
        expect(account.isCorrectPassword("wrongPassword")).toEqual(false);
    });
});
