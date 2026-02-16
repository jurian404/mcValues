class McBoolean {
    constructor(value) {
        this.__value = value;
    }

    get value() {
        return this.__value;
    }

    [Symbol.toPrimitive]() {
        return this.__value;
    }

    get usedBytes() {
        return 1;
    }
}

function read(buffer, offset = 0) {
    if (buffer.length - 1 < offset) {
        throw new Error("Boolean ran out of range");
    }
    const byte = buffer[offset];
    if (byte === 0x00) {
        return new McBoolean(false);
    } else if (byte === 0x01) {
        return new McBoolean(true);
    } else {
        throw new Error("Invalid boolean value: 0x" + byte.toString(16).padStart(2, "0"));
    }
}

function write(value) {
    if (value) {
        return Buffer.from([0x01]);
    }
    return Buffer.from([0x00]);
}

module.exports = {
    read,
    write
}