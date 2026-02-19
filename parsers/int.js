const int = require('./subParser/numbers');

class Int {
    #value;

    constructor(value) {
        this.#value = value;
    }

    [Symbol.toPrimitive]() {
        return this.#value;
    }

    get value() {
        return this.#value;
    }

    get usedBytes() {
        return 4;
    }
}

function read(buffer, offset = 0){
    return new Int(int.read(buffer, 4, offset));
}

function write(value) {
    return int.write(value, 4);
}

module.exports = {
    read,
    write
}