const numbers = require('./subParser/numbers');
const McValue = require("../utils/mcValue");
const Parser = require("../utils/parser");

class UnsignedByte extends McValue {
    constructor(value) {
        super(value, 1);
    }
}

class UnsignedByteParser extends Parser {
    constructor() {
        super();
        throw new Error("This is a static class");
    }

    static read(buffer, offset = 0) {
        return new UnsignedByte(numbers.unsignedRead(buffer, 1, offset));
    }

    static write(value) {
        return numbers.unsignedWrite(value, 1);
    }
}

module.exports = UnsignedByteParser