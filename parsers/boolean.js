const calcOffset = require("../utils/offset");
const McValue = require("../utils/mcValue");
const Parser = require("../utils/parser");

class McBoolean extends McValue {
    constructor(value) {
        super(value, 1);
    }
}

class BooleanParser extends Parser {
    constructor() {
        super();
        throw new Error("This is a static class");
    }

    static read(buffer, offset = 0) {
        offset = calcOffset(offset, buffer.length);
        if (buffer.length - 1 < offset) {
            throw new Error("Boolean ran out of range");
        }
        const byte = buffer[offset];
        if (byte === 0x00) {
            return new McBoolean(false);
        } else if (byte === 0x01) {
            return new McBoolean(true);
        } else {
            throw new Error("Invalid boolean value: 0x" + byte.toString(16).padStart(2, "0"));
        }
    }

    static write(value) {
        if (value) {
            return Buffer.from([0x01]);
        }
        return Buffer.from([0x00]);
    }
}

module.exports = BooleanParser