const { read } = require('../parsers/varInt');

describe('readVarInt', () => {

    it('should read VarInt from buffer', () => {
        const tests = [
            [Buffer.from([0x00]), 0],
            [Buffer.from([0x01]), 1],
            [Buffer.from([0x02, 0xff]), 2],
            [Buffer.from([0x7f]), 127],
            [Buffer.from([0x80, 0x01]), 128],
            [Buffer.from([0xff, 0x01]), 255],
            [Buffer.from([0xdd, 0xc7, 0x01, 0x01]), 25565],
            [Buffer.from([0xff, 0xff, 0x7f]), 2097151],
            [Buffer.from([0xff, 0xff, 0xff, 0xff, 0x07]), 2147483647],
            [Buffer.from([0xff, 0xff, 0xff, 0xff, 0x0f]), -1],
            [Buffer.from([0x80, 0x80, 0x80, 0x80, 0x08, 0xff]), -2147483648]
        ]
        for (const [buffer, expected] of tests) {
            expect(read(buffer).value).toBe(expected);
        }
    });

    it('should read VarInt from buffer with offset', () => {
        const tests = [
            [Buffer.from([0x00, 0xff, 0x00, 0xd1]), 2, 0],
            [Buffer.from([0xf1, 0x01, 0x22]), 1, 1],
            [Buffer.from([0xdd, 0x02, 0xff]), 1, 2],
            [Buffer.from([0x7f, 0x00, 0x7f]), 2, 127],
            [Buffer.from([0xff, 0x80, 0x01]), 1, 128],
            [Buffer.from([0x00, 0x10,0xff, 0xff, 0xff, 0xff, 0x0f, 0xdd]), 2, -1],
            [Buffer.from([0x00, 0x80, 0x80, 0x80, 0x80, 0x08, 0x08]), 1, -2147483648]
        ]
        for (const [buffer, offset, expected] of tests) {
            expect(read(buffer, offset).value).toBe(expected);
        }
    });




    it('should read simple VarInts', () => {
        const buffer0 = Buffer.from([0x00]);
        const buffer1 = Buffer.from([0x01]);
        const buffer2 = Buffer.from([0xff, 0x02]);
        const buffer3 = Buffer.from([0x7f]);
        const buffer4 = Buffer.from([0x80, 0x01]);
        const buffer5 = Buffer.from([0xff, 0x01]);
        const buffer6 = Buffer.from([0xff, 0xff, 0x7f, 0xdd, 0xc7, 0x01]);
        const buffer7 = Buffer.from([0xff, 0xff, 0x7f]);
        const buffer8 = Buffer.from([0xff, 0xff, 0xff, 0xff, 0x07]);
        const buffer9 = Buffer.from([0xff, 0xff, 0xff, 0xff, 0x0f]);
        const buffer10 = Buffer.from([0x11, 0x80, 0x80, 0x80, 0x80, 0x08]);

        const offset2 = 1;
        const offset6 = 3;
        const offset10 = 1;

        expect(read(buffer0).value).toBe(0);
        expect(read(buffer1).value).toBe(1);
        expect(read(buffer2, offset2).value).toBe(2);
        expect(read(buffer3).value).toBe(127);
        expect(read(buffer4).value).toBe(128);
        expect(read(buffer5).value).toBe(255);
        expect(read(buffer6, offset6).value).toBe(25565);
        expect(read(buffer7).value).toBe(2097151);
        expect(read(buffer8).value).toBe(2147483647);
        expect(read(buffer9).value).toBe(-1);
        expect(read(buffer10, offset10).value).toBe(-2147483648);
    });

    it('should throw if VarInt is out of range', () => {
        const buffer = Buffer.from([0x80, 0x80, 0x80, 0x80, 0x80]);
        expect(() => read(buffer)).toThrow("Variable Integer wasn't correctly finished");
    });

    it('should throw if VarInt is not correctly finished', () => {
        const buffer = Buffer.from([0x80, 0x80, 0x80, 0x80, 0xff]);
        expect(() => read(buffer)).toThrow("Variable Integer wasn't correctly finished");
    });

});