const int = require('./subParser/numbers');

class UnsignedShort {
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
        return 2;
    }
}

function read(buffer, offset = 0){
    return new UnsignedShort(int.unsignedRead(buffer, 2, offset));
}

function write(value) {
    return int.unsignedWrite(value, 2);
}

module.exports = {
    read,
    write
}