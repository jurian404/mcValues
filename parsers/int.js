const int = require('./subParser/numbers');
const McValue = require("../utils/mcValue");
const Parser = require("../utils/parser");

class Int extends McValue {
    constructor(value) {
        super(value, 4);
    }
}

class IntParser extends Parser {
    constructor() {
        super();
        throw new Error("This is a static class");
    }

    static read(buffer, offset = 0) {
        return new Int(int.read(buffer, 4, offset));
    }

    static write(value) {
        return int.write(value, 4);
    }
}

module.exports = IntParser