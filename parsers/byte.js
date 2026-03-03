const numbers = require('./subParser/numbers');
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
        return new Byte(numbers.read(buffer, 1, offset));
    }

    static write(value) {
        return numbers.write(value, 1);
    }
}

module.exports = ByteParser