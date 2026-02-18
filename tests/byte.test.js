const mcValue = require("../index");

describe("byte", () => {
    const readExamples = [
        [Buffer.from([0x00]),0],
        [Buffer.from([0x01]),1],
        [Buffer.from([0x7f]),127],
        [Buffer.from([0x80]),-128],
        [Buffer.from([0xff]),-1]
    ];

    const readExamplesWithRemainingBytes = [
        [Buffer.from([0x02,0xff]),2],
        [Buffer.from([0x7f,0x00]),127]
    ];

    const readExamplesWithOffset = [
        [Buffer.from([0x00,0x00]),1,0],
        [Buffer.from([0x01,0x01]),1,1],
        [Buffer.from([0xff,0x00,0x7f]),2,127]
    ];

    it("reads values", () => {
        for (const [buffer, expected] of readExamples) {
            expect(mcValue.byte.read(buffer).value).toBe(expected);
        }
    });

    it("reads values with remaining bytes", () => {
        for (const [buffer, expected] of readExamplesWithRemainingBytes) {
             expect(mcValue.byte.read(buffer).value).toBe(expected);
        }
    });

    it("reads values with offset", () => {
        for (const [buffer, offset, expected] of readExamplesWithOffset) {
            expect(mcValue.byte.read(buffer, offset).value).toBe(expected);
        }
    });

    it("throws when buffer is too short", () => {
        const tests = [Buffer.from([])];
        for (const buffer of tests) {
            expect(() => mcValue.byte.read(buffer)).toThrow();
        }
    });

    it("writes values", () => {
        for (const [expected, number] of readExamples) {
            expect(mcValue.byte.write(number)).toStrictEqual(expected);
        }
    });

    it("throws when value is out of range", () => {
        const tests = [128, -129,256, -1000];
        for (const number of tests) {
             expect(() => mcValue.byte.write(number)).toThrow();
        }
    });
});
