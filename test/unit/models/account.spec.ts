import sinon from "sinon";
import {Keypair} from "@chainsafe/bls/lib/keypair";

// Mock keystore, only address is important
const mockKeystore = {
    version: 3,
    id: "6ea112aa-4f1c-4135-a061-ee4c55be0e92",
    address: "c840359492685ceb239b34742100d343e1eaa66c",
    crypto: {
        ciphertext:
      "232b269cf14de72399be10640bfeb6abf90844d6e0234635195d65b293acf457",
        cipherparams: {iv: "497c566a8ce0d22f9f0a62dc7db7f327"},
        cipher: "aes-128-ctr",
        kdf: "scrypt",
        kdfparams: {
            dklen: 32,
            salt: "2679d31db8b7be7cd8f9c59fbe9e4df8a1c3d9268a001782c4ba1798ee0fb916",
            n: 131072,
            r: 8,
            p: 1
        },
        mac: "6f28f837c69cdc89b87a1b696d92b38e6bc60fa5b4ac166d65871afdabb2e6bb"
    }
};

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
import {Eth1KeystoreFactory} from "../../../src/renderer/services/keystore";
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
            .stub(Eth1KeystoreFactory.prototype, "getAddress")
            .returns("0x001");
        sandbox
            .stub(Eth1KeystoreFactory.prototype, "decrypt")
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
