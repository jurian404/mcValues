const mcValue = require("../index");

describe("byte", () => {
    const readExamples = [
        [Buffer.from([0x00]), 0],
        [Buffer.from([0x01]), 1],
        [Buffer.from([0x7f]), 127],
        [Buffer.from([0x80]), -128],
        [Buffer.from([0xff]), -1]
    ];

    const readExamplesWithRemainingBytes = [
        [Buffer.from([0x02, 0xff]), 2],
        [Buffer.from([0x7f, 0x00]), 127]
    ];

    const readExamplesWithOffset = [
        [Buffer.from([0x00, 0x00]), 1, 0],
        [Buffer.from([0x01, 0x01]), 1, 1],
        [Buffer.from([0xff, 0x00, 0x7f]), 2, 127]
    ];

    const readExamplesWithNegativeOffset = [
        [Buffer.from([0x00, 0x7f]), -1, 127],
        [Buffer.from([0x00, 0x01]), -1, 1],
        [Buffer.from([0xff, 0x00, 0x80]), -1, -128],
        [Buffer.from([0x01, 0x02, 0xff]), -1, -1],
        [Buffer.from([0x00, 0x7f, 0x80]), -2, 127],
        [Buffer.from([0xff, 0x01, 0xbb, 0x01]), -3, 1]
    ];

    const shortBufferExamples = [
        Buffer.from([])
    ];

    const writeOutOfRangeExamples = [
        128,
        -129,
        256,
        -1000
    ];

    it("reads values", () => {
        for (const [buffer, expected] of readExamples) {
            expect(mcValue.byte.read(buffer).value).toBe(expected);
            expect(mcValue.read(buffer, mcValue.byte).value).toBe(expected);
        }
    });

    it("read usedBytes", () => {
        for (const part of readExamples) {
            expect(mcValue.byte.read(part[0]).usedBytes).toBe(1);
        }
    });

    it("reads values with remaining bytes", () => {
        for (const [buffer, expected] of readExamplesWithRemainingBytes) {
            expect(mcValue.byte.read(buffer).value).toBe(expected);
        }
    });

    it("reads values with offset", () => {
        for (const [buffer, offset, expected] of readExamplesWithOffset) {
            expect(mcValue.byte.read(buffer, offset).value).toBe(expected);
            expect(mcValue.read(buffer, mcValue.byte, offset).value).toBe(expected);
        }
    });

    it("reads values with negative offset", () => {
        for (const [buffer, offset, expected] of readExamplesWithNegativeOffset) {
            expect(mcValue.byte.read(buffer, offset).value).toBe(expected);
        }
    });

    it("throws when buffer is too short", () => {
        for (const buffer of shortBufferExamples) {
            expect(() => mcValue.byte.read(buffer)).toThrow("Ran out of buffer");
            expect(() => mcValue.read(buffer, mcValue.byte)).toThrow("Ran out of buffer");
        }
    });

    it("writes values", () => {
        for (const [expected, number] of readExamples) {
            expect(mcValue.byte.write(number)).toStrictEqual(expected);
            expect(mcValue.write(number, mcValue.byte)).toStrictEqual(expected);
        }
    });

    it("throws when value is out of range", () => {
        for (const number of writeOutOfRangeExamples) {
            expect(() => mcValue.byte.write(number)).toThrow("Value is out of range: " + number);
            expect(() => mcValue.write(number, mcValue.byte)).toThrow("Value is out of range: " + number);
        }
    });
});
