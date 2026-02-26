const int = require('./subParser/numbers');
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
        return new UnsignedShort(int.unsignedRead(buffer, 2, offset));
    }

    static write(value) {
        return int.unsignedWrite(value, 2);
    }
}

module.exports = UnsignedShortParser