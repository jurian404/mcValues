const mcValue = require("../index");


describe("boolean", () => {
    const readExamples = [
        [Buffer.from([0x00]), false],
        [Buffer.from([0x01]), true]
    ];

    const readExamplesWithRemainingBytes = [
        [Buffer.from([0x00, 0x01]), false],
        [Buffer.from([0x01, 0x00]), true]
    ];

    const readExamplesWithOffset = [
        [Buffer.from([0x00, 0x01]), 1, true],
        [Buffer.from([0xf1, 0x01, 0x00]), 2, false]
    ];

    const readExamplesWithNegativeOffset = [
        [Buffer.from([0xaa, 0x01]), -1, true],
        [Buffer.from([0xbb, 0xcc, 0x00]), -1, false],
        [Buffer.from([0xff, 0x01, 0x00]), -2, true],
        [Buffer.from([0x00, 0x00, 0x01, 0xff]), -3, false]
    ];

    const shortBufferExamples = [
        [Buffer.from([]), 0],
        [Buffer.from([0x00]), 1],
        [Buffer.from([0x01]), 1]
    ];

    const invalidValueExamples = [
        Buffer.from([0x02]),
        Buffer.from([0xff])
    ];

    const writeExamples = [
        [true, Buffer.from([0x01])],
        [false, Buffer.from([0x00])],
        [1, Buffer.from([0x01])],
        [0, Buffer.from([0x00])],
        ["string", Buffer.from([0x01])]
    ];

    it("reads values", () => {
        for (const [buffer, expected] of readExamples) {
            expect(mcValue.boolean.read(buffer).value).toBe(expected);
        }
    });

    it("reads values with remaining bytes", () => {
        for (const [buffer, expected] of readExamplesWithRemainingBytes) {
            expect(mcValue.boolean.read(buffer).value).toBe(expected);
        }
    });

    it("reads values with offset", () => {
        for (const [buffer, offset, expected] of readExamplesWithOffset) {
            expect(mcValue.boolean.read(buffer, offset).value).toBe(expected);
        }
    });

    it("reads values with negative offset", () => {
        for (const [buffer, offset, expected] of readExamplesWithNegativeOffset) {
            expect(mcValue.boolean.read(buffer, offset).value).toBe(expected);
        }
    });

    it("throws when buffer is too short", () => {
        for (const [buffer, offset] of shortBufferExamples) {
            expect(() => mcValue.boolean.read(buffer, offset)).toThrow("Boolean ran out of range");
        }
    });

    it("throws when value is not 0 or 1", () => {
        for (const buffer of invalidValueExamples) {
            expect(() => mcValue.boolean.read(buffer)).toThrow("Invalid boolean value: 0x" + buffer[0].toString(16).padStart(2, "0"));
        }
    });

    it("writes values", () => {
        for (const [value, expected] of writeExamples) {
            expect(mcValue.boolean.write(value)).toStrictEqual(expected);
        }
    });
});