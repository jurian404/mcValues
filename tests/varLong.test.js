const mcValue = require("../index");

describe("varLong", () => {
    const readExamples = [
        [Buffer.from([0x00]), 0n, 1],
        [Buffer.from([0x01]), 1n, 1],
        [Buffer.from([0x02]), 2n, 1],
        [Buffer.from([0x7f]), 127n, 1],
        [Buffer.from([0x80, 0x01]), 128n, 2],
        [Buffer.from([0xff, 0x01]), 255n, 2],
        [Buffer.from([0xff, 0xff, 0xff, 0xff, 0x07]), 2147483647n, 5],
        [Buffer.from([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f]), 9223372036854775807n, 9],
        [Buffer.from([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01]), -1n, 10],
        [Buffer.from([0x80, 0x80, 0x80, 0x80, 0xf8, 0xff, 0xff, 0xff, 0xff, 0x01]), -2147483648n, 10],
        [Buffer.from([0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x01]), -9223372036854775808n, 10]
    ];

    const readExamplesWithRemainingBytes = [
        [Buffer.from([0x02, 0xff]), 2n],
        [Buffer.from([0x7f, 0xff]), 127n],
        [Buffer.from([0xff, 0xff, 0xff, 0xff, 0x07, 0x44, 0xff, 0x10]), 2147483647n]
    ];

    const readExamplesWithOffset = [
        [Buffer.from([0x00, 0x00]), 1, 0n],
        [Buffer.from([0x01, 0x01]), 1, 1n],
        [Buffer.from([0xff, 0x3f, 0x63, 0x00, 0x7f]), 4, 127n],
        [Buffer.from([0x80, 0xff, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]), 1, 255n],
        [Buffer.from([0xff, 0x23, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x01, 0xff, 0x23]), 2, -9223372036854775808n]
    ];

    const readExamplesWithNegativeOffset = [
        [Buffer.from([0x00, 0xff]), -2, 0n],
        [Buffer.from([0xff, 0x01]), -1, 1n],
        [Buffer.from([0x01, 0x02, 0xff, 0xdd]), -3, 2n],
        [Buffer.from([0x7f]), -1, 127n],
        [Buffer.from([0x80, 0x01]), -2, 128n],
        [Buffer.from([0x00, 0xff, 0x01, 0xff]), -3, 255n],
        [Buffer.from([0xdd, 0xff, 0xff, 0xff, 0xff, 0x07]), -5, 2147483647n],
        [Buffer.from([0xa5, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f]), -9, 9223372036854775807n],
        [Buffer.from([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01, 0x45]), -11, -1n],
        [Buffer.from([0x00, 0x80, 0x80, 0x80, 0x80, 0xf8, 0xff, 0xff, 0xff, 0xff, 0x01, 0xa2, 0xf1]), -12, -2147483648n],
        [Buffer.from([0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x01]), -10, -9223372036854775808n]
    ];

    it("reads values", () => {
        for (const [buffer, expected, used] of readExamples) {
            expect(mcValue.varLong.read(buffer).value).toBe(expected);
            expect(mcValue.read(buffer, mcValue.varLong).value).toBe(expected);
        }
    });

    it("read usedBytes", () => {
        for (const [buffer, expected, used] of readExamples) {
            expect(mcValue.varLong.read(buffer).usedBytes).toBe(used);
        }
    });

    it("reads values with remaining bytes", () => {
        for (const [buffer, expected] of readExamplesWithRemainingBytes) {
            expect(mcValue.varLong.read(buffer).value).toBe(expected);
        }
    });

    it("reads values with offset", () => {
        for (const [buffer, offset, expected] of readExamplesWithOffset) {
            expect(mcValue.varLong.read(buffer, offset).value).toBe(expected);
            expect(mcValue.read(buffer, mcValue.varLong, offset).value).toBe(expected);
        }
    });

    it("reads values with negative offset", () => {
        for (const [buffer, offset, expected] of readExamplesWithNegativeOffset) {
            expect(mcValue.varLong.read(buffer, offset).value).toBe(expected);
        }
    });

    it("throws when out of range", () => {
        const tests = [
            Buffer.from([0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80]),
            Buffer.from([0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x03, 0x80]),
            Buffer.from([0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0xff])
        ];

        for (const buffer of tests) {
            expect(() => mcValue.varLong.read(buffer)).toThrow("Variable Integer wasn't correctly finished. The last byte should be either 0x00 or 0x01");
        }
    });

    it("throws when buffer is too short", () => {
        const tests = [
            Buffer.from([]),
            Buffer.from([0x80]),
            Buffer.from([0x80, 0x80]),
            Buffer.from([0x80, 0x80, 0x80]),
            Buffer.from([0x80, 0x80, 0x80, 0x80]),
            Buffer.from([0x80, 0x80, 0x80, 0x80, 0x80]),
            Buffer.from([0x80, 0x80, 0x80, 0x80, 0x80, 0x80]),
            Buffer.from([0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80]),
            Buffer.from([0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80]),
            Buffer.from([0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80])
        ];

        for (const buffer of tests) {
            expect(() => mcValue.varLong.read(buffer)).toThrow("Variable Integer ran out of range");
            expect(() => mcValue.read(buffer, mcValue.varLong)).toThrow("Variable Integer ran out of range");
        }
    });

    it("writes values", () => {
        for (const [expected, number] of readExamples) {
            expect(mcValue.varLong.write(number)).toStrictEqual(expected);
            expect(mcValue.write(number, mcValue.varLong)).toStrictEqual(expected);
        }
    });

    it("throws when value is out of range", () => {
        const tests = [
            9223372036854775808n,
            2908209810920928190820n,
            -9223372036854775809n,
            -922337203684354775808n
        ];

        for (const number of tests) {
            expect(() => mcValue.varLong.write(number)).toThrow(`Value is out of range for VarLong: ${number}`);
            expect(() => mcValue.write(number, mcValue.varLong)).toThrow(`Value is out of range for VarLong: ${number}`);
        }
    });
});