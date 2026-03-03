const mcValue = require("../index");

describe("float", () => {
    const readExamples = [
        [Buffer.from([0x00, 0x00, 0x00, 0x00]), 0],
        [Buffer.from([0x3f, 0x80, 0x00, 0x00]), 1],
        [Buffer.from([0xbf, 0x80, 0x00, 0x00]), -1],
        [Buffer.from([0x42, 0xf6, 0xe9, 0x79]), 123.45600128173828],
        [Buffer.from([0x7f, 0x80, 0x00, 0x00]), Infinity],
        [Buffer.from([0xff, 0x80, 0x00, 0x00]), -Infinity],
        [Buffer.from([0b01111111, 11000000, 0b00000000, 0b00000000]), NaN],
    ];

    const differentNaNRepresentations = [
        Buffer.from([0b01111111, 11000000, 0b10000000, 0b00000000]),
        Buffer.from([0b01111111, 11000000, 0b00000000, 0b00000000]),
        Buffer.from([0b01111111, 11000000, 0b01010101, 0b10101010]),
        Buffer.from([0b01111111, 11000000, 0b00101010, 0b01010101])
    ];

    const readExamplesWithRemainingBytes = [
        [Buffer.from([0x3f, 0x80, 0x00, 0x00, 0xff]), 1],
        [Buffer.from([0xbf, 0x80, 0x00, 0x00, 0x00]), -1]
    ];

    const readExamplesWithOffset = [
        [Buffer.from([0x00, 0x3f, 0x80, 0x00, 0x00]), 1, 1],
        [Buffer.from([0xff, 0x42, 0xf6, 0xe9, 0x79]), 1, 123.45600128173828]
    ];

    const readExamplesWithNegativeOffset = [
        [Buffer.from([0xff, 0x3f, 0x80, 0x00, 0x00]), -4, 1],
        [Buffer.from([0xaa, 0x42, 0xf6, 0xe9, 0x79, 0xbb]), -5, 123.45600128173828]
    ];

    const shortBufferExamples = [
        Buffer.from([]),
        Buffer.from([0x00]),
        Buffer.from([0x00, 0x00, 0x00])
    ];

    it("reads values", () => {
        for (const [buffer, expected] of readExamples) {
            const result = mcValue.float.read(buffer).value;

            if (Number.isNaN(expected)) {
                expect(Number.isNaN(result)).toBe(true);
            } else {
                expect(result).toBe(expected);
            }

            expect(mcValue.read(buffer, mcValue.float).value).toBe(expected);
        }

        for (const buffer of differentNaNRepresentations) {
            expect(Number.isNaN(mcValue.float.read(buffer).value)).toBe(true);
        }
    });

    it("read usedBytes", () => {
        for (const part of readExamples) {
            expect(mcValue.float.read(part[0]).usedBytes).toBe(4);
        }
    });

    it("reads values with remaining bytes", () => {
        for (const [buffer, expected] of readExamplesWithRemainingBytes) {
            expect(mcValue.float.read(buffer).value).toBe(expected);
        }
    });

    it("reads values with offset", () => {
        for (const [buffer, offset, expected] of readExamplesWithOffset) {
            expect(mcValue.float.read(buffer, offset).value).toBe(expected);
            expect(mcValue.read(buffer, mcValue.float, offset).value).toBe(expected);
        }
    });

    it("reads values with negative offset", () => {
        for (const [buffer, offset, expected] of readExamplesWithNegativeOffset) {
            expect(mcValue.float.read(buffer, offset).value).toBe(expected);
        }
    });

    it("throws when buffer is too short", () => {
        for (const buffer of shortBufferExamples) {
            expect(() => mcValue.float.read(buffer)).toThrow("Ran out of buffer");
            expect(() => mcValue.read(buffer, mcValue.float)).toThrow("Ran out of buffer");
        }
    });

    it("writes values", () => {
        for (const [expectedBuffer, number] of readExamples) {
            expect(mcValue.float.write(number)).toStrictEqual(expectedBuffer);
            expect(mcValue.write(number, mcValue.float)).toStrictEqual(expectedBuffer);
        }
    });
});