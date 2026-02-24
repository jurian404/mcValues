const mcValue = require("../index");

describe("varInt", () => {
    const readExamples = [
        [Buffer.from([0x00]), 0],
        [Buffer.from([0x01]), 1],
        [Buffer.from([0x02]), 2],
        [Buffer.from([0x7f]), 127],
        [Buffer.from([0x80, 0x01]), 128],
        [Buffer.from([0xff, 0x01]), 255],
        [Buffer.from([0xdd, 0xc7, 0x01]), 25565],
        [Buffer.from([0xff, 0xff, 0x7f]), 2097151],
        [Buffer.from([0xff, 0xff, 0xff, 0xff, 0x07]), 2147483647],
        [Buffer.from([0xff, 0xff, 0xff, 0xff, 0x0f]), -1],
        [Buffer.from([0x80, 0x80, 0x80, 0x80, 0x08]), -2147483648]
    ];

    const readExamplesWithRemainingBytes = [
        [Buffer.from([0x00, 0x23]), 0],
        [Buffer.from([0x01, 0x10]), 1],
        [Buffer.from([0x02, 0xff]), 2],
        [Buffer.from([0xff, 0x01, 0x43, 0xff]), 255],
        [Buffer.from([0xff, 0xff, 0xff, 0xff, 0x07, 0x34, 0xfa]), 2147483647],
        [Buffer.from([0xff, 0xff, 0xff, 0xff, 0x0f, 0x10, 0xff, 0x32]), -1],
        [Buffer.from([0x80, 0x80, 0x80, 0x80, 0x08, 0xff, 0x10, 0xaf, 0x80]), -2147483648]

    ];

    const readExamplesWithOffset = [
        [Buffer.from([0x00, 0xff, 0x00, 0xd1]), 2, 0],
        [Buffer.from([0xf1, 0x01, 0x22]), 1, 1],
        [Buffer.from([0xdd, 0x02, 0xff]), 1, 2],
        [Buffer.from([0x7f, 0x00, 0x7f]), 2, 127],
        [Buffer.from([0xff, 0x80, 0x01]), 1, 128],
        [Buffer.from([0x00, 0x10, 0xff, 0xff, 0xff, 0xff, 0x0f, 0xdd]), 2, -1],
        [Buffer.from([0x00, 0x80, 0x80, 0x80, 0x80, 0x08, 0x08]), 1, -2147483648]
    ];

    const readExamplesWithNegativeOffset = [
        [Buffer.from([0x00, 0xff, 0x00, 0xd1]), -2, 0],
        [Buffer.from([0xf1, 0x01, 0x22, 0xda]), -3, 1],
        [Buffer.from([0xdd, 0x02, 0xff, 0x23, 0x5d, 0x00]), -5, 2],
        [Buffer.from([0x7f, 0x00, 0x7f]), -1, 127],
        [Buffer.from([0xff, 0x80, 0x01]), -2, 128],
        [Buffer.from([0x00, 0x10, 0xff, 0xff, 0xff, 0xff, 0x0f, 0xdd]), -6, -1],
        [Buffer.from([0x00, 0x80, 0x80, 0x80, 0x80, 0x08, 0x08]), -6, -2147483648]
    ];

    it("reads values", () => {
        for (const [buffer, expected] of readExamples) {
            expect(mcValue.varInt.read(buffer).value).toBe(expected);
        }
    });

    it("reads values with remaining bytes", () => {
        for (const [buffer, expected] of readExamplesWithRemainingBytes) {
            expect(mcValue.varInt.read(buffer).value).toBe(expected);
        }
    });

    it("reads values with offset", () => {
        for (const [buffer, offset, expected] of readExamplesWithOffset) {
            expect(mcValue.varInt.read(buffer, offset).value).toBe(expected);
        }
    });

    it("reads values with negative offset", () => {
        for (const [buffer, offset, expected] of readExamplesWithNegativeOffset) {
            expect(mcValue.varInt.read(buffer, offset).value).toBe(expected);
        }
    });

    it("throws when buffer is too short", () => {
        const tests = [
            Buffer.from([]),
            Buffer.from([0x80]),
            Buffer.from([0x80, 0x80]),
            Buffer.from([0x80, 0x80, 0x80]),
            Buffer.from([0x80, 0x80, 0x80, 0x80])
        ];

        for (const buffer of tests) {
            expect(() => mcValue.varInt.read(buffer)).toThrow("Variable Integer ran out of the buffer");
        }
    });

    it("throws when out of range", () => {
        const tests = [
            Buffer.from([0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80]),
            Buffer.from([0x80, 0x80, 0x80, 0x80, 0x80, 0x80]),
            Buffer.from([0x80, 0x80, 0x80, 0x80, 0x80])
        ];

        for (const buffer of tests) {
            expect(() => mcValue.varInt.read(buffer)).toThrow("Variable Integer wasn't correctly finished. Is it maybe a VarLong?");
        }
    });

    it("writes values", () => {
        for (const [expected, number] of readExamples) {
            expect(mcValue.varInt.write(number)).toStrictEqual(expected);
        }
    });

    it("throws when value is out of range", () => {
        const tests = [
            2147483648,
            -2147483649
        ];

        for (const number of tests) {
            expect(() => mcValue.varInt.write(number)).toThrow(`Value is out of range for VarLong: ${number}`);
        }
    });

});