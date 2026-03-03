const McValue = require("../utils/mcValue");
const Parser = require("../utils/parser");
const calcOffset = require("../utils/offset");

class Float extends McValue {
    constructor(value) {
        super(value, 4);
    }
}

class FloatParser extends Parser {
    constructor() {
        super();
        throw new Error("This is a static class");
    }

    static read(buffer, offset = 0) {
        if (!Buffer.isBuffer(buffer)) {
            throw new Error("Provided data is not a buffer");
        }
        offset = calcOffset(offset, buffer.length);
        if (buffer.length < 4 + offset){
            throw new Error("Ran out of buffer");
        }
        const value = buffer.readFloatBE(offset);
        return new Float(value, 4);
    }

    static write(value) {
        if (typeof value !== "number") {
            throw new Error("Provided value is not a number");
        }
        const buffer = Buffer.alloc(4);
        buffer.writeFloatBE(value);
        return buffer;
    }
}

module.exports = FloatParser