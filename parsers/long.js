const int = require('./subParser/bigInt');

class Long {
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
        return 8;
    }
}

function read(buffer, offset = 0){
    return new Long(int.read(buffer, 8, offset));
}

function write(value) {
    return int.write(value, 8);
}

module.exports = {
    read,
    write
}