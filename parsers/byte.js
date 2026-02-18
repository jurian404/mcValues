const int = require('./int');


class Byte {
    #value;
    #usedBytes = 1;

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
        return this.#usedBytes;
    }
}

function read(buffer, offset = 0){
    return new Byte(int.read(buffer, 1, offset));
}

function write(value) {
    return int.write(value, 1);
}

module.exports = {
    read,
    write
}