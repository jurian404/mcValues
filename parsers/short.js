const numbers = require('./subParser/numbers');
const McValue = require("../utils/mcValue");
const Parser = require("../utils/parser");

class Short extends McValue {
    constructor(value) {
        super(value, 2);
    }
}

class ShortParser extends Parser {
    constructor() {
        super();
        throw new Error("This is a static class");
    }

    static read(buffer, offset = 0) {
        return new Short(numbers.read(buffer, 2, offset));
    }

    static write(value) {
        return numbers.write(value, 2);
    }
}

module.exports = ShortParser