import passwordComplexity from "../../../../src/renderer/services/validation/password-complexity";
import {ValidationResult} from "@hapi/joi";

describe("JoiPasswordComplexity", () => {
    it("should reject a password that is too short", () => {
        const password = "123";
        const result: ValidationResult = passwordComplexity().required().validate(password);
        const errors = result.error.details.filter((e) => e.type === "string.length.tooShort");
        expect(errors.length).toBe(1);
        expect(errors[0].message).toBe("have at least 8 characters");
    });
    it("should reject a password that is too long", () => {
        const password = "123456791234567912345679123";

        const result: ValidationResult = passwordComplexity().required().validate(password);
        const errors = result.error.details.filter((e) => e.type === "string.length.tooLong");

        expect(errors.length).toBe(1);
        expect(errors[0].message).toBe("not be longer than 26 characters");
    });

    it("should reject a password that doesn't meet the required lowercase count", () => {
        const password = "ABCDEFG";

        const result: ValidationResult = passwordComplexity().required().validate(password);
        const errors = result.error.details.filter((e) => e.type === "passwordComplexity.lowercase");

        expect(errors.length).toBe(1);
        expect(errors[0].message).toBe("1 lowercased letter");
    });

    it("should reject a password that doesn't meet the required uppercase count", () => {
        const password = "abcdefg";

        const result: ValidationResult = passwordComplexity().required().validate(password);
        const errors = result.error.details.filter((e) => e.type === "passwordComplexity.uppercase");

        expect(errors.length).toBe(1);
        expect(errors[0].message).toBe("1 uppercased letter");
    });

    it("should reject a password that doesn't meet the required numeric count", () => {
        const password = "ABCDEFG";

        const result: ValidationResult = passwordComplexity().required().validate(password);
        const errors = result.error.details.filter((e) => e.type === "passwordComplexity.numeric");

        expect(errors.length).toBe(1);
        expect(errors[0].message).toBe("1 number");
    });

    it("should reject a password that doesn't meet the required symbol count", () => {
        const password = "ABCDEFG";

        const result: ValidationResult = passwordComplexity().required().validate(password);
        const errors = result.error.details.filter((e) => e.type === "passwordComplexity.symbol");

        expect(errors.length).toBe(1);
        expect(errors[0].message).toBe("1 symbol");
    });

    it("should accept a valid password with default options", () => {
        const password = "abCD12#$";
        const result: ValidationResult = passwordComplexity().required().validate(password);

        expect(result.error).toBeUndefined();
    });

    it("should accept a password that meets a requirement count", () => {
        const password = "Password123";

        const result: ValidationResult = passwordComplexity({
            min: 8,
            max: 30,
            lowerCase: 1,
            upperCase: 1,
            numeric: 1,
            symbol: 1,
            requirementCount: 3,
        }).required().validate(password);

        expect(result.error).toBeUndefined();
    });

    it("should accept a password that has no requirement count", () => {
        const password = "Password123";
        const result: ValidationResult = passwordComplexity({
            min: 8,
            max: 30,
            lowerCase: 1,
            upperCase: 1,
            numeric: 1,
            symbol: 0,
            requirementCount: 0,
        }).required().validate(password);

        expect(result.error).toBeUndefined();
    });

    it("should reject a password that fails other requirements without a requirement count", () => {
        const password = "Password";
        const result: ValidationResult = passwordComplexity({
            min: 8,
            max: 30,
            lowerCase: 1,
            upperCase: 1,
            numeric: 1,
            symbol: 0,
            requirementCount: 0,
        }).required().validate(password);

        const errors = result.error.details.filter((e) => e.type === "passwordComplexity.numeric");

        expect(errors.length).toBe(1);
        expect(errors[0].message).toBe("1 number");
    });

    it("should treat a requirement count that is higher than 4 as no requirement count", () => {
        const password = "Password12";
        const result: ValidationResult = passwordComplexity({
            min: 8,
            max: 30,
            lowerCase: 1,
            upperCase: 1,
            numeric: 1,
            symbol: 0,
            requirementCount: 100,
        }).required().validate(password);

        expect(result.error).toBeUndefined();
    });
});