const mcValue = require("../index");

describe("short", () => {
    const readExamples = [
        [Buffer.from([0x00, 0x00]), 0],
        [Buffer.from([0x00, 0x01]), 1],
        [Buffer.from([0x7f, 0xff]), 32767],
        [Buffer.from([0x80, 0x00]), -32768],
        [Buffer.from([0xff, 0xff]), -1]
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

    const shortBufferExamples = [
        Buffer.from([]),
        Buffer.from([0x00])
    ];

    const writeOutOfRangeExamples = [
        32768,
        -32769
    ];

    it("reads values", () => {
        for (const [buffer, expected] of readExamples) {
            expect(mcValue.short.read(buffer).value).toBe(expected);
        }
    });

    it("reads values with remaining bytes", () => {
        for (const [buffer, expected] of readExamplesWithRemainingBytes) {
            expect(mcValue.short.read(buffer).value).toBe(expected);
        }
    });

    it("reads values with offset", () => {
        for (const [buffer, offset, expected] of readExamplesWithOffset) {
            expect(mcValue.short.read(buffer, offset).value).toBe(expected);
        }
    });

    it("throws when buffer is too short", () => {
        for (const buffer of shortBufferExamples) {
            expect(() => mcValue.short.read(buffer)).toThrow();
        }
    });

    it("writes values", () => {
        for (const [expected, number] of readExamples) {
            expect(mcValue.short.write(number)).toStrictEqual(expected);
        }
    });

    it("throws when value is out of range", () => {
        for (const number of writeOutOfRangeExamples) {
            expect(() => mcValue.short.write(number)).toThrow();
        }
    });
});

