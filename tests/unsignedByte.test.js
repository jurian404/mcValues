const mcValue = require("../index");

describe("unsignedByte", () => {
    const readExamples = [
        [Buffer.from([0x00]), 0],
        [Buffer.from([0x01]), 1],
        [Buffer.from([0x7f]), 127],
        [Buffer.from([0x80]), 128],
        [Buffer.from([0xff]), 255]
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
        [Buffer.from([0x00, 0x01, 0xff]), -1, 255],
        [Buffer.from([0xff, 0x00, 0x80]), -1, 128],
        [Buffer.from([0x01, 0x02, 0x03, 0x7f]), -1, 127],
        [Buffer.from([0x00, 0x01, 0x80]), -2, 1],
        [Buffer.from([0xff, 0xaa, 0xbb, 0xcc]), -3, 170]
    ];

    const shortBufferExamples = [
        Buffer.from([])
    ];

    const writeOutOfRangeExamples = [
        256,
        -1,
        -128,
        1000
    ];

    it("reads values", () => {
        for (const [buffer, expected] of readExamples) {
            expect(mcValue.unsignedByte.read(buffer).value).toBe(expected);
        }
    });

    it("read usedBytes", () => {
        for (const part of readExamples) {
            expect(mcValue.unsignedByte.read(part[0]).usedBytes).toBe(1);
        }
    });

    it("reads values with remaining bytes", () => {
        for (const [buffer, expected] of readExamplesWithRemainingBytes) {
            expect(mcValue.unsignedByte.read(buffer).value).toBe(expected);
        }
    });

    it("reads values with offset", () => {
        for (const [buffer, offset, expected] of readExamplesWithOffset) {
            expect(mcValue.unsignedByte.read(buffer, offset).value).toBe(expected);
        }
    });

    it("reads values with negative offset", () => {
        for (const [buffer, offset, expected] of readExamplesWithNegativeOffset) {
            expect(mcValue.unsignedByte.read(buffer, offset).value).toBe(expected);
        }
    });

    it("throws when buffer is too short", () => {
        for (const buffer of shortBufferExamples) {
            expect(() => mcValue.unsignedByte.read(buffer)).toThrow("Ran out of buffer");
        }
    });

    it("writes values", () => {
        for (const [expected, number] of readExamples) {
            expect(mcValue.unsignedByte.write(number)).toStrictEqual(expected);
        }
    });

    it("throws when value is out of range", () => {
        for (const number of writeOutOfRangeExamples) {
            expect(() => mcValue.unsignedByte.write(number)).toThrow("Value is out of range: " + number);
        }
    });
});
