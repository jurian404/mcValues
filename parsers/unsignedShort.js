const numbers = require('./subParser/numbers');
const McValue = require("../utils/mcValue");
const Parser = require("../utils/parser");

class UnsignedShort extends McValue {
    constructor(value) {
        super(value, 2);
    }
}

class UnsignedShortParser extends Parser {
    constructor() {
        super();
        throw new Error("This is a static class");
    }

    static read(buffer, offset = 0) {
        return new UnsignedShort(numbers.unsignedRead(buffer, 2, offset));
    }

    static write(value) {
        return numbers.unsignedWrite(value, 2);
    }
}

module.exports = UnsignedShortParser