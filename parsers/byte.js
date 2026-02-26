const int = require('./subParser/numbers');
const McValue = require("../utils/mcValue");
const Parser = require("../utils/parser");

class Byte extends McValue {
    constructor(value) {
        super(value, 1);
    }
}

class ByteParser extends Parser {
    constructor() {
        super();
        throw new Error("This is a static class");
    }

    static read(buffer, offset = 0) {
        return new Byte(int.read(buffer, 1, offset));
    }

    static write(value) {
        return int.write(value, 1);
    }
}

module.exports = ByteParser