const int = require('./subParser/bigInt');
const McValue = require("../utils/mcValue");
const Parser = require("../utils/parser");

class Long extends McValue {
    constructor(value) {
        super(value, 8);
    }
}

class LongParser extends Parser {
    constructor() {
        super();
        throw new Error("This is a static class");
    }

    static read(buffer, offset = 0) {
        return new Long(int.read(buffer, 8, offset));
    }

    static write(value) {
        return int.write(value, 8);
    }
}

module.exports = LongParser