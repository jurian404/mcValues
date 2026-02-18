const mcValue = require("../index");


describe("boolean", () => {
    it("reads values", () => {
        const tests = [
            [Buffer.from([0x00]), false],
            [Buffer.from([0x01]), true]
        ];

        for (const [buffer, expected] of tests) {
            expect(mcValue.boolean.read(buffer).value).toBe(expected);
        }
    });

    it("reads values with offset", () => {
        const tests = [
            [Buffer.from([0x00, 0x01]), 1, true],
            [Buffer.from([0xf1, 0x01, 0x00]), 2, false]
        ];

        for (const [buffer, offset, expected] of tests) {
            expect(mcValue.boolean.read(buffer, offset).value).toBe(expected);
        }
    });

    it("throws when buffer is too short", () => {
        const tests = [
            [Buffer.from([]), 0],
            [Buffer.from([0x00]), 1],
            [Buffer.from([0x01]), 1]
        ];

        for (const [buffer, offset] of tests) {
            expect(() => mcValue.boolean.read(buffer, offset)).toThrow("Boolean ran out of range");
        }
    });

    it("throws when value is not 0 or 1", () => {
        const tests = [
            Buffer.from([0x02]),
            Buffer.from([0xff])
        ];

        for (const buffer of tests) {
            expect(() => mcValue.boolean.read(buffer)).toThrow("Invalid boolean value: 0x" + buffer[0].toString(16).padStart(2, "0"));
        }
    });

    it("writes values", () => {
        const tests = [
            [true, Buffer.from([0x01])],
            [false, Buffer.from([0x00])],
            [1, Buffer.from([0x01])],
            [0, Buffer.from([0x00])],
            ["string", Buffer.from([0x01])]
        ];

        for (const [value, expected] of tests) {
            expect(mcValue.boolean.write(value)).toStrictEqual(expected);
        }
    });
});