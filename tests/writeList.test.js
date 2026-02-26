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
            mcValue.boolean,
            mcValue.byte,
            mcValue.unsignedByte,
            mcValue.short,
            mcValue.unsignedShort,
            mcValue.int,
            mcValue.long,
            mcValue.varInt,
            mcValue.varLong,
            mcValue.string
        ];

        const values = [
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
        ];

        const result = mcValue.write(values, schema);
        expect(result).toStrictEqual(buffer);
    });

    it("parses multiple data types in correct order", () => {
        const buffer = Buffer.from([
            0x01,                   // BOOLEAN (true)
            0x7f,                   // BYTE (127)
            0x00, 0x02,             // SHORT (2)
            0x00, 0x00, 0x00, 0x05  // INT (5)
        ]);

        const schema = [
            mcValue.boolean,
            mcValue.byte,
            mcValue.short,
            mcValue.int
        ];

        const values = [
            true,
            127,
            2,
            5
        ];

        const result = mcValue.write(values, schema);
        expect(result).toStrictEqual(buffer);
    });

    it("parses STRING correctly", () => {
        const buffer = Buffer.from([
            0x03,                   // VarInt length = 3
            0x61, 0x62, 0x63        // "abc"
        ]);

        const schema = [
            mcValue.string
        ];

        const values = ["abc"]

        const result = mcValue.write(values, schema);
        expect(result).toStrictEqual(buffer);
    });


    it("throws on unsupported data type", () => {
        const schema = ["UNKNOWN_TYPE"];

        expect(() => mcValue.write(["test"], schema))
            .toThrow("Given data type is not supported.");
    });

    it("throws on data isn't an array", () => {
        const schema = [mcValue.boolean];
        expect(() => mcValue.write({test:"test"}, schema)).toThrow("Writer can't process this inputs");
        expect(() => mcValue.write("test", schema)).toThrow("Writer can't process this inputs");
    });

    it("throws on too many data types", () => {
        expect(() => mcValue.write([], [mcValue.boolean])).toThrow("Invalid or missing value");
        expect(() => mcValue.write([0x01], [mcValue.boolean, mcValue.boolean])).toThrow("Invalid or missing value");
    });
});
