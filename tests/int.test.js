const mcValue = require("../index");

describe("int", () => {
    const readExamples = [
        [Buffer.from([0x00, 0x00, 0x00, 0x00]), 0],
        [Buffer.from([0x00, 0x00, 0x00, 0x01]), 1],
        [Buffer.from([0x7f, 0xff, 0xff, 0xff]), 2147483647],
        [Buffer.from([0x80, 0x00, 0x00, 0x00]), -2147483648],
        [Buffer.from([0xff, 0xff, 0xff, 0xff]), -1]
    ];

    const readExamplesWithRemainingBytes = [
        [Buffer.from([0x00, 0x00, 0x00, 0x02, 0xff]), 2],
        [Buffer.from([0x7f, 0xff, 0xff, 0xff, 0x00]), 2147483647]
    ];

    const readExamplesWithOffset = [
        [Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00]), 1, 0],
        [Buffer.from([0x01, 0x00, 0x00, 0x00, 0x01]), 1, 1],
        [Buffer.from([0xff, 0x00, 0x7f, 0xff, 0xff, 0xff]), 2, 2147483647]
    ];

    const readExamplesWithNegativeOffset = [
        [Buffer.from([0xff, 0x00, 0x00, 0x00, 0x00, 0x22]), -5, 0],
        [Buffer.from([0xdd, 0x00, 0x00, 0x00, 0x00, 0x01, 0xff, 0xda]), -6, 1],
        [Buffer.from([0xff, 0x7f, 0xff, 0xff, 0xff, 0xad]), -5, 2147483647],
        [Buffer.from([0x00, 0x89, 0x80, 0x00, 0x00, 0x00, 0xfa]), -5, -2147483648],
    ];

    const shortBufferExamples = [
        Buffer.from([]),
        Buffer.from([0x00]),
        Buffer.from([0x00, 0x00, 0x00])
    ];

    const writeOutOfRangeExamples = [
        2147483648,
        -2147483649
    ];

    it("reads values", () => {
        for (const [buffer, expected] of readExamples) {
            expect(mcValue.int.read(buffer).value).toBe(expected);
        }
    });

    it("read usedBytes", () => {
        for (const part of readExamples) {
            expect(mcValue.int.read(part[0]).usedBytes).toBe(4);
        }
    });

    it("reads values with remaining bytes", () => {
        for (const [buffer, expected] of readExamplesWithRemainingBytes) {
            expect(mcValue.int.read(buffer).value).toBe(expected);
        }
    });

    it("reads values with offset", () => {
        for (const [buffer, offset, expected] of readExamplesWithOffset) {
            expect(mcValue.int.read(buffer, offset).value).toBe(expected);
        }
    });

    it("reads values with negative offset", () => {
        for (const [buffer, offset, expected] of readExamplesWithNegativeOffset) {
            expect(mcValue.int.read(buffer, offset).value).toBe(expected);
        }
    });

    it("throws when buffer is too short", () => {
        for (const buffer of shortBufferExamples) {
            expect(() => mcValue.int.read(buffer)).toThrow("Ran out of buffer");
        }
    });

    it("writes values", () => {
        for (const [expected, number] of readExamples) {
            expect(mcValue.int.write(number)).toStrictEqual(expected);
        }
    });

    it("throws when value is out of range", () => {
        for (const number of writeOutOfRangeExamples) {
            expect(() => mcValue.int.write(number)).toThrow("Value is out of range: " + number);
        }
    });
});

