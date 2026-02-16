const mcValue = require("../index");

describe('readVarInt', () => {
    const examplesWithoutOffset = [
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

    const examplesWithRemainingBytes = [
        [Buffer.from([0x00, 0x23]), 0],
        [Buffer.from([0x01, 0x10]), 1],
        [Buffer.from([0x02, 0xff]), 2],
        [Buffer.from([0xff, 0x01, 0x43, 0xff]), 255],
        [Buffer.from([0xff, 0xff, 0xff, 0xff, 0x07, 0x34, 0xfa]), 2147483647],
        [Buffer.from([0xff, 0xff, 0xff, 0xff, 0x0f, 0x10, 0xff, 0x32]), -1],
        [Buffer.from([0x80, 0x80, 0x80, 0x80, 0x08, 0xff, 0x10, 0xaf, 0x80]), -2147483648]

    ];

    const examplesWithOffset = [
        [Buffer.from([0x00, 0xff, 0x00, 0xd1]), 2, 0],
        [Buffer.from([0xf1, 0x01, 0x22]), 1, 1],
        [Buffer.from([0xdd, 0x02, 0xff]), 1, 2],
        [Buffer.from([0x7f, 0x00, 0x7f]), 2, 127],
        [Buffer.from([0xff, 0x80, 0x01]), 1, 128],
        [Buffer.from([0x00, 0x10,0xff, 0xff, 0xff, 0xff, 0x0f, 0xdd]), 2, -1],
        [Buffer.from([0x00, 0x80, 0x80, 0x80, 0x80, 0x08, 0x08]), 1, -2147483648]
    ];


    it('should read simple VarInt', () => {
        for (const [buffer, expected] of examplesWithoutOffset) {
            expect(mcValue.varInt.read(buffer).value).toBe(expected);
        }
    });

    it('should read varInts with remaining bytes', () => {
        for (const [buffer, expected] of examplesWithRemainingBytes) {
            expect(mcValue.varInt.read(buffer).value).toBe(expected);
        }
    });

    it('should read varInts with offset', () => {
        for (const [buffer, offset, expected] of examplesWithOffset) {
            expect(mcValue.varInt.read(buffer, offset).value).toBe(expected);
        }
    });

    it('should throw if varInts is out of range', () => {
        const tests = [
            Buffer.from([0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80]),
            Buffer.from([0x80, 0x80, 0x80, 0x80, 0x80, 0x80]),
            Buffer.from([0x80, 0x80, 0x80, 0x80, 0x80]),
        ]
        for (const buffer of tests) {
            expect(() => mcValue.varInt.read(buffer)).toThrow("Variable Integer wasn't correctly finished. Is it maybe a VarLong?");
        }
    });

    it('should throw if ran out of the buffer', () => {
        const tests = [
            Buffer.from([]),
            Buffer.from([0x80]),
            Buffer.from([0x80, 0x80]),
            Buffer.from([0x80, 0x80, 0x80]),
            Buffer.from([0x80, 0x80, 0x80, 0x80])
        ]
        for (const buffer of tests) {
            expect(() => mcValue.varInt.read(buffer)).toThrow("Variable Integer ran out of the buffer");
        }
    });

    it('should write simple varInts', () => {
        for (const [expected, number] of examplesWithoutOffset) {
            expect(mcValue.varInt.write(number)).toStrictEqual(expected);
        }
    });

    it('should throw out of range error', () => {
        const tests = [
            2147483648,
            -2147483649,
        ];
        for (const number of tests) {
            expect(() =>  mcValue.varInt.write(number)).toThrow(`Value is out of range for VarLong: ${number}`);
        }
    });

});