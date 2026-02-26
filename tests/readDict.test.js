const mcValue = require("../index");

describe("parseWithSchema", () => {

    it("parses all supported data types in one schema correctly", () => {

        const buffer = Buffer.from([
            0x01,                         // BOOLEAN (true)
            0x7f,                         // BYTE (127)
            0xff,                         // UNSIGNED_BYTE (255)
            0x00, 0x02,                   // SHORT (2)
            0x00, 0x03,                   // UNSIGNED_SHORT (3)
            0x00, 0x00, 0x00, 0x04,       // INT (4)
            0x00, 0x00, 0x00, 0x00,       // LONG (5n)
            0x00, 0x00, 0x00, 0x05,
            0x06,                         // VAR_INT (6)
            0x07,                         // VAR_LONG (7n)
            0x03,                         // STRING length (VarInt = 3)
            0x68, 0x65, 0x79              // "hey"
        ]);

        const schema = {
            boolean: mcValue.boolean,
            byte: mcValue.byte,
            unsignedByte: mcValue.unsignedByte,
            short: mcValue.short,
            unsignedShort: mcValue.unsignedShort,
            int: mcValue.int,
            long: mcValue.long,
            varInt: mcValue.varInt,
            varLong: mcValue.varLong,
            string: mcValue.string
        };

        const values = {
            boolean: true,
            byte: 127,
            unsignedByte:255,
            short: 2,
            unsignedShort: 3,
            int: 4,
            long: 5n,
            varInt: 6,
            varLong: 7n,
            string: "hey"
        }

        const result = mcValue.read(buffer, schema);

        expect(result.value).toStrictEqual(values);

        expect(result.usedBytes).toBe(25);
        expect(result.parts).not.toStrictEqual(result.usedBytes);
    });

    it("parses multiple data types in correct order", () => {
        const buffer = Buffer.from([
            0x01,                   // BOOLEAN (true)
            0x7f,                   // BYTE (127)
            0x00, 0x02,             // SHORT (2)
            0x00, 0x00, 0x00, 0x05  // INT (5)
        ]);

        const schema = {
            boolean: mcValue.boolean,
            byte: mcValue.byte,
            short: mcValue.short,
            int: mcValue.int,
        };

        const values = {
            boolean: true,
            byte: 127,
            short: 2,
            int: 5
        };

        const result = mcValue.read(buffer, schema);

        expect(result.value).toStrictEqual(values);

        expect(result.usedBytes).toBe(1 + 1 + 2 + 4);
        expect(result.parts).not.toStrictEqual(result.usedBytes);
    });


    it("respects offset", () => {
        const buffer = Buffer.from([
            0xff,                   // dummy
            0x00, 0x01,             // SHORT (1)
            0x00, 0x00, 0x00, 0x02  // INT (2)
        ]);

        const schema = {
            short: mcValue.short,
            int: mcValue.int,
        };

        const values = {
            short: 1,
            int: 2,
        };

        const result = mcValue.read(buffer, schema, 1);

        expect(result.value).toStrictEqual(values);
        expect(result.usedBytes).toBe(2 + 4);
        expect(result.parts).not.toStrictEqual(result.usedBytes);
    });


    it("respects negative offset", () => {
        const buffer = Buffer.from([
            0xaa,
            0x00, 0x03,             // SHORT (3)
            0x00, 0x00, 0x00, 0x04  // INT (4)
        ]);

        const schema = {
            shortNumber: mcValue.short,
            integer: mcValue.int,
        };

        const values = {
            shortNumber: 3,
            integer: 4,
        };

        const result = mcValue.read(buffer, schema, -6);

        expect(result.value).toStrictEqual(values);
        expect(result.usedBytes).toBe(2 + 4);
    });


    it("parses STRING correctly", () => {
        const buffer = Buffer.from([
            0x03,                   // VarInt length = 3
            0x61, 0x62, 0x63        // "abc"
        ]);

        const schema = {
            name: mcValue.string,
        };

        const values = {
            name: "abc"
        };

        const result = mcValue.read(buffer, schema);

        expect(result.value).toStrictEqual(values);
        expect(result.usedBytes).toBe(1 + 3);
    });


    it("throws on unsupported data type", () => {
        const buffer = Buffer.from([0x00]);

        const schema = {noType: "UNKNOWN_TYPE"};

        expect(() => mcValue.read(buffer, schema))
            .toThrow("Given data type is not supported.");
    });
});
