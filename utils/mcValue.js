class McValue {
    #value;
    #usedBytes;

    constructor(value, usedBytes) {
        this.#value = value;
        this.#usedBytes = usedBytes;
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

module.exports = McValue;