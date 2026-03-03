const McValue = require("../utils/mcValue");
const Parser = require("../utils/parser");
const calcOffset = require("../utils/offset");

class Double extends McValue {
    constructor(value) {
        super(value, 8);
    }
}

class DoubleParser extends Parser {
    constructor() {
        super();
        throw new Error("This is a static class");
    }

    static read(buffer, offset = 0) {
        if (!Buffer.isBuffer(buffer)) {
            throw new Error("Provided data is not a buffer");
        }
        offset = calcOffset(offset, buffer.length);
        if (buffer.length < 8 + offset){
            throw new Error("Ran out of buffer");
        }
        const value = buffer.readDoubleBE(offset);
        return new Double(value, 8);
    }

    static write(value) {
        if (typeof value !== "number") {
            throw new Error("Provided value is not a number");
        }
        const buffer = Buffer.alloc(8);
        buffer.writeDoubleBE(value);
        return buffer;
    }
}

module.exports = DoubleParser