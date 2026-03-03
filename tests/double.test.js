const mcValue = require("../index");

describe("double", () => {
    const readExamples = [
        [Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), 0],
        [Buffer.from([0x3f, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), 1],
        [Buffer.from([0xbf, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), -1],
        [Buffer.from([0x40, 0x5e, 0xdd, 0x2f, 0x1a, 0x9f, 0xbe, 0x77]), 123.456],
        [Buffer.from([0x7f, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), Infinity],
        [Buffer.from([0xff, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), -Infinity],
        [Buffer.from([0x7f, 0xf8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), NaN],

        // zusätzliche zufällige Werte
        [Buffer.from([0x40, 0x09, 0x21, 0xfb, 0x54, 0x44, 0x2d, 0x18]), 3.141592653589793],
        [Buffer.from([0xc0, 0x09, 0x21, 0xfb, 0x54, 0x44, 0x2d, 0x18]), -3.141592653589793],
        [Buffer.from([0x40, 0x59, 0x0c, 0xcc, 0xcc, 0xcc, 0xcc, 0xcd]), 100.2],
        [Buffer.from([0xc0, 0x59, 0x0c, 0xcc, 0xcc, 0xcc, 0xcc, 0xcd]), -100.2],
        [Buffer.from([0x40, 0x2d, 0xf8, 0x54, 0x3f, 0x3d, 0x70, 0xa4]), 14.985017753839493],
        [Buffer.from([0xc0, 0x2d, 0xf8, 0x54, 0x3f, 0x3d, 0x70, 0xa4]), -14.985017753839493]
    ];

    const differentNaNRepresentations = [
        Buffer.from([0x7f, 0xf8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]),
        Buffer.from([0x7f, 0xf8, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00]),
        Buffer.from([0x7f, 0xf8, 0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc]),
    ];

    const readExamplesWithRemainingBytes = [
        [Buffer.from([0x3f, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff]), 1],
        [Buffer.from([0xbf, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), -1],
    ];

    const readExamplesWithOffset = [
        [Buffer.from([0x00, 0x3f, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), 1, 1],
        [Buffer.from([0xff, 0x40, 0x5e, 0xdd, 0x2f, 0x1a, 0x9f, 0xbe, 0x77]), 1, 123.456],
    ];

    const readExamplesWithNegativeOffset = [
        [Buffer.from([0xff, 0x3f, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), -8, 1],
        [Buffer.from([0xaa, 0x40, 0x5e, 0xdd, 0x2f, 0x1a, 0x9f, 0xbe, 0x77, 0xbb]), -9, 123.456],
    ];

    const shortBufferExamples = [
        Buffer.from([]),
        Buffer.from([0x00]),
        Buffer.from([0x00, 0x00, 0x00]),
        Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
    ];

    it("reads values", () => {
        for (const [buffer, expected] of readExamples) {
            const result = mcValue.double.read(buffer).value;

            if (Number.isNaN(expected)) {
                expect(Number.isNaN(result)).toBe(true);
            } else {
                expect(result).toBe(expected);
            }

            expect(mcValue.read(buffer, mcValue.double).value).toBe(expected);
        }

        for (const buffer of differentNaNRepresentations) {
            expect(Number.isNaN(mcValue.double.read(buffer).value)).toBe(true);
        }
    });

    it("read usedBytes", () => {
        for (const part of readExamples) {
            expect(mcValue.double.read(part[0]).usedBytes).toBe(8);
        }
    });

    it("reads values with remaining bytes", () => {
        for (const [buffer, expected] of readExamplesWithRemainingBytes) {
            expect(mcValue.double.read(buffer).value).toBe(expected);
        }
    });

    it("reads values with offset", () => {
        for (const [buffer, offset, expected] of readExamplesWithOffset) {
            expect(mcValue.double.read(buffer, offset).value).toBe(expected);
            expect(mcValue.read(buffer, mcValue.double, offset).value).toBe(expected);
        }
    });

    it("reads values with negative offset", () => {
        for (const [buffer, offset, expected] of readExamplesWithNegativeOffset) {
            expect(mcValue.double.read(buffer, offset).value).toBe(expected);
        }
    });

    it("throws when buffer is too short", () => {
        for (const buffer of shortBufferExamples) {
            expect(() => mcValue.double.read(buffer)).toThrow("Ran out of buffer");
            expect(() => mcValue.read(buffer, mcValue.double)).toThrow("Ran out of buffer");
        }
    });

    it("writes values", () => {
        for (const [expectedBuffer, number] of readExamples) {
            expect(mcValue.double.write(number)).toStrictEqual(expectedBuffer);
            expect(mcValue.write(number, mcValue.double)).toStrictEqual(expectedBuffer);
        }
    });
});