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

        const schema = [
            mcValue.dataTypes.BOOLEAN,
            mcValue.dataTypes.BYTE,
            mcValue.dataTypes.UNSIGNED_BYTE,
            mcValue.dataTypes.SHORT,
            mcValue.dataTypes.UNSIGNED_SHORT,
            mcValue.dataTypes.INT,
            mcValue.dataTypes.LONG,
            mcValue.dataTypes.VAR_INT,
            mcValue.dataTypes.VAR_LONG,
            mcValue.dataTypes.STRING
        ];

        const result = mcValue.parseWithSchema(buffer, schema);

        expect(result.value).toStrictEqual([
            true,       // BOOLEAN
            127,        // BYTE
            255,        // UNSIGNED_BYTE
            2,          // SHORT
            3,          // UNSIGNED_SHORT
            4,          // INT
            5n,         // LONG
            6,          // VAR_INT
            7n,         // VAR_LONG
            "hey"       // STRING
        ]);

        // Gesamtlänge aller Bytes
        expect(result.usedBytes).toBe(25);
    });

    it("parses multiple data types in correct order", () => {
        const buffer = Buffer.from([
            0x01,                   // BOOLEAN (true)
            0x7f,                   // BYTE (127)
            0x00, 0x02,             // SHORT (2)
            0x00, 0x00, 0x00, 0x05  // INT (5)
        ]);

        const schema = [
            mcValue.dataTypes.BOOLEAN,
            mcValue.dataTypes.BYTE,
            mcValue.dataTypes.SHORT,
            mcValue.dataTypes.INT
        ];

        const result = mcValue.parseWithSchema(buffer, schema);

        expect(result.value).toStrictEqual([
            true,
            127,
            2,
            5
        ]);

        expect(result.usedBytes).toBe(1 + 1 + 2 + 4);
    });


    it("respects offset", () => {
        const buffer = Buffer.from([
            0xff,                   // dummy
            0x00, 0x01,             // SHORT (1)
            0x00, 0x00, 0x00, 0x02  // INT (2)
        ]);

        const schema = [
            mcValue.dataTypes.SHORT,
            mcValue.dataTypes.INT
        ];

        const result = mcValue.parseWithSchema(buffer, schema, 1);

        expect(result.value).toStrictEqual([1, 2]);
        expect(result.usedBytes).toBe(2 + 4);
    });


    it("respects negative offset", () => {
        const buffer = Buffer.from([
            0xaa,
            0x00, 0x03,             // SHORT (3)
            0x00, 0x00, 0x00, 0x04  // INT (4)
        ]);

        const schema = [
            mcValue.dataTypes.SHORT,
            mcValue.dataTypes.INT
        ];

        // -6 → beginnt bei SHORT
        const result = mcValue.parseWithSchema(buffer, schema, -6);

        expect(result.value).toStrictEqual([3, 4]);
        expect(result.usedBytes).toBe(2 + 4);
    });


    it("parses STRING correctly", () => {
        // STRING parser nutzt vermutlich VarInt-Länge + UTF-8
        // Beispiel: Länge 3, "abc"
        const buffer = Buffer.from([
            0x03,                   // VarInt length = 3
            0x61, 0x62, 0x63        // "abc"
        ]);

        const schema = [
            mcValue.dataTypes.STRING
        ];

        const result = mcValue.parseWithSchema(buffer, schema);

        expect(result.value).toStrictEqual(["abc"]);
        expect(result.usedBytes).toBe(1 + 3);
    });


    it("throws on unsupported data type", () => {
        const buffer = Buffer.from([0x00]);

        const schema = ["UNKNOWN_TYPE"];

        expect(() => mcValue.parseWithSchema(buffer, schema))
            .toThrow("Given data type is not supported.");
    });
});
