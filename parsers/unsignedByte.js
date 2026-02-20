const int = require('./subParser/numbers');

class UnsignedByte {
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
        return 1;
    }
}

function read(buffer, offset = 0){
    return new UnsignedByte(int.unsignedRead(buffer, 1, offset));
}

function write(value) {
    return int.unsignedWrite(value, 1);
}

module.exports = {
    read,
    write
}