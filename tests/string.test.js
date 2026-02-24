const mcValue = require("../index");

describe("string", () => {

    const readExamples = [
        [Buffer.from([0x00]), ""],
        [Buffer.from([0x01, 0x61]), "a"],
        [Buffer.from([0x05, 0x48, 0x65, 0x6c, 0x6c, 0x6f]), "Hello"],
        [Buffer.from([0x0c, ...Buffer.from("Hello World!")]), "Hello World!"],
        [Buffer.from([0x02, 0xc3, 0xa4]), "ä"]
    ];

    const readExamplesWithRemainingBytes = [
        [Buffer.from([0x01, 0x61, 0xff]), "a"],
        [Buffer.from([0x05, ...Buffer.from("Hello"), 0x00, 0x01]), "Hello"]
    ];

    const readExamplesWithOffset = [
        [Buffer.from([0xff, 0x01, 0x61]), 1, "a"],
        [Buffer.from([0x00, 0x05, ...Buffer.from("Hello"), 0x22]), 1, "Hello"]
    ];

    const shortBufferExamples = [
        Buffer.from([]),
        Buffer.from([0x01]),
        Buffer.from([0x05, 0x48, 0x65]),
        Buffer.from([0x02, 0xc3])
    ];

    const invalidLengthExamples = [
        [Buffer.from([0xff, 0xff, 0xff, 0xff, 0xff, 0x50]), "String length is too big"], // absurd large length
        [Buffer.from([0x80, 0x80, 0x80, 0x80]), "String ran out of the buffer"],  // unfinished VarInt
        [Buffer.from([0xff, 0xff, 0xff, 0xff, 0x0f]), "String length cannot negative"] // negative length
    ];

    const invalidStringExamples = [
        [Buffer.from([0x05, 0xff, 0xff, 0xff]), "String ran out of the buffer"],
        [Buffer.from([0x0f, 0xc3, 0xa4, 0x00]), "String ran out of the buffer"],
        [Buffer.from([0xc0, 0xbe, 0x02, ...Buffer.from("a".repeat(41000))]), "String is too long"]
    ];

    const writeExamples = [
        ["", Buffer.from([0x00])],
        ["a", Buffer.from([0x01, 0x61])],
        ["Hello", Buffer.from([0x05, 0x48, 0x65, 0x6c, 0x6c, 0x6f])],
        ["ä", Buffer.from([0x02, 0xc3, 0xa4])]
    ];

    it("reads values", () => {
        for (const [buffer, expected] of readExamples) {
            expect(mcValue.string.read(buffer).value).toBe(expected);
        }
    });

    it("reads values with remaining bytes", () => {
        for (const [buffer, expected] of readExamplesWithRemainingBytes) {
            expect(mcValue.string.read(buffer).value).toBe(expected);
        }
    });

    it("reads values with offset", () => {
        for (const [buffer, offset, expected] of readExamplesWithOffset) {
            expect(mcValue.string.read(buffer, offset).value).toBe(expected);
        }
    });

    it("throws when buffer is too short", () => {
        for (const buffer of shortBufferExamples) {
            expect(() => mcValue.string.read(buffer)).toThrow("String ran out of the buffer");
        }
    });

    it("throws when length is invalid or VarInt not finished", () => {
        for (const [buffer, error] of invalidLengthExamples) {
            expect(() => mcValue.string.read(buffer)).toThrow(error);
        }
    });

    it("throws when string is invalid", () => {
        for (const [buffer, error] of invalidStringExamples) {
            expect(() => mcValue.string.read(buffer)).toThrow(error);
        }
    });

    it("writes values", () => {
        for (const [value, expected] of writeExamples) {
            expect(mcValue.string.write(value)).toStrictEqual(expected);
        }
    }); 

    it("throws when value exceeds maximum length", () => {
        const longString = "a".repeat(40000);

        expect(() => mcValue.string.write(longString))
            .toThrow("String is too long");
    });

});