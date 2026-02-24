const mcValue = require("../index");

describe("long", () => {
    const readExamples = [
        [Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), 0n],
        [Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]), 1n],
        [Buffer.from([0x7f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]), 9223372036854775807n],
        [Buffer.from([0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), -9223372036854775808n],
        [Buffer.from([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]), -1n]
    ];

    const readExamplesWithRemainingBytes = [
        [Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff]), 2n],
        [Buffer.from([0x7f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x00]), 9223372036854775807n]
    ];

    const readExamplesWithOffset = [
        [Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), 1, 0n],
        [Buffer.from([0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]), 1, 1n],
        [Buffer.from([0xff, 0x00, 0x7f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]), 2, 9223372036854775807n]
    ];

    const readExamplesWithNegativeOffset = [
        [Buffer.from([0xff, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), -8, 0n],
        [Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]), -8, 1n],
        [Buffer.from([0xff, 0x7f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]), -8, 9223372036854775807n],
        [Buffer.from([0x00, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), -8, -9223372036854775808n],
        [Buffer.from([0xff, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff]), -9, 0n],
        [Buffer.from([0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0xa1]), -9, 1n],
        [Buffer.from([0xff, 0xda, 0x00, 0x7f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xda, 0x34]), -10, 9223372036854775807n]
    ];

    const shortBufferExamples = [
        Buffer.from([]),
        Buffer.from([0x00]),
        Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
    ];

    const writeOutOfRangeExamples = [
        9223372036854775808n,
        -9223372036854775809n
    ];

    it("reads values", () => {
        for (const [buffer, expected] of readExamples) {
            expect(mcValue.long.read(buffer).value).toBe(expected);
        }
    });

    it("read usedBytes", () => {
        for (const part of readExamples) {
            expect(mcValue.long.read(part[0]).usedBytes).toBe(8);
        }
    });

    it("reads values with remaining bytes", () => {
        for (const [buffer, expected] of readExamplesWithRemainingBytes) {
            expect(mcValue.long.read(buffer).value).toBe(expected);
        }
    });

    it("reads values with offset", () => {
        for (const [buffer, offset, expected] of readExamplesWithOffset) {
            expect(mcValue.long.read(buffer, offset).value).toBe(expected);
        }
    });

    it("reads values with negative offset", () => {
        for (const [buffer, offset, expected] of readExamplesWithNegativeOffset) {
            expect(mcValue.long.read(buffer, offset).value).toBe(expected);
        }
    });

    it("throws when buffer is too short", () => {
        for (const buffer of shortBufferExamples) {
            expect(() => mcValue.long.read(buffer)).toThrow("Ran out of buffer");
        }
    });

    it("writes values", () => {
        for (const [expected, number] of readExamples) {
            expect(mcValue.long.write(number)).toStrictEqual(expected);
        }
    });

    it("throws when value is out of range", () => {
        for (const number of writeOutOfRangeExamples) {
            expect(() => mcValue.long.write(number)).toThrow("Value is out of range: " + number);
        }
    });
});
