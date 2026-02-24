const mcValue = require("../index");

describe("unsignedShort", () => {
    const readExamples = [
        [Buffer.from([0x00, 0x00]), 0],
        [Buffer.from([0x00, 0x01]), 1],
        [Buffer.from([0x7f, 0xff]), 32767],
        [Buffer.from([0x80, 0x00]), 32768],
        [Buffer.from([0xff, 0xff]), 65535]
    ];

    const readExamplesWithRemainingBytes = [
        [Buffer.from([0x00, 0x02, 0xff]), 2],
        [Buffer.from([0x7f, 0xff, 0x00]), 32767]
    ];

    const readExamplesWithOffset = [
        [Buffer.from([0x00, 0x00, 0x00]), 1, 0],
        [Buffer.from([0x01, 0x00, 0x01]), 1, 1],
        [Buffer.from([0xff, 0x00, 0x7f, 0xff]), 2, 32767]
    ];

    const readExamplesWithNegativeOffset = [
        [Buffer.from([0x00, 0x00, 0xda, 0xaa]), -4, 0],
        [Buffer.from([0x00, 0x01, 0x00]), -3, 1],
        [Buffer.from([0x00, 0x7f, 0xff]), -2, 32767],
        [Buffer.from([0xaa, 0x80, 0x00, 0xff]), -3, 32768],
        [Buffer.from([0x53, 0xff, 0xff, 0x00, 0xda]), -4, 65535]
    ];

    const shortBufferExamples = [
        Buffer.from([]),
        Buffer.from([0x00])
    ];

    const writeOutOfRangeExamples = [
        65536,
        -1,
        -32768,
        100000
    ];

    it("reads values", () => {
        for (const [buffer, expected] of readExamples) {
            expect(mcValue.unsignedShort.read(buffer).value).toBe(expected);
        }
    });

    it("read usedBytes", () => {
        for (const part of readExamples) {
            expect(mcValue.unsignedShort.read(part[0]).usedBytes).toBe(2);
        }
    });

    it("reads values with remaining bytes", () => {
        for (const [buffer, expected] of readExamplesWithRemainingBytes) {
            expect(mcValue.unsignedShort.read(buffer).value).toBe(expected);
        }
    });

    it("reads values with offset", () => {
        for (const [buffer, offset, expected] of readExamplesWithOffset) {
            expect(mcValue.unsignedShort.read(buffer, offset).value).toBe(expected);
        }
    });

    it("reads values with negative offset", () => {
        for (const [buffer, offset, expected] of readExamplesWithNegativeOffset) {
            expect(mcValue.unsignedShort.read(buffer, offset).value).toBe(expected);
        }
    });

    it("throws when buffer is too short", () => {
        for (const buffer of shortBufferExamples) {
            expect(() => mcValue.unsignedShort.read(buffer)).toThrow("Ran out of buffer");
        }
    });

    it("writes values", () => {
        for (const [expected, number] of readExamples) {
            expect(mcValue.unsignedShort.write(number)).toStrictEqual(expected);
        }
    });

    it("throws when value is out of range", () => {
        for (const number of writeOutOfRangeExamples) {
            expect(() => mcValue.unsignedShort.write(number)).toThrow("Value is out of range: " + number);
        }
    });
});

