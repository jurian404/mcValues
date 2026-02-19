const int = require('./subParser/numbers');

class Short {
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
    return new Short(int.read(buffer, 2, offset));
}

function write(value) {
    return int.write(value, 2);
}

module.exports = {
    read,
    write
}