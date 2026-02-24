const varInt = require('./varInt');

class McString {
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

function read(buffer, offset = 0) {
    let length;
    try {
        length = varInt.read(buffer, offset);

    } catch (error){
        switch (error.message) {
            case "Variable Integer ran out of the buffer":
                throw new Error('String ran out of the buffer');
            case "Variable Integer wasn't correctly finished. Is it maybe a VarLong?":
                throw new Error('String length is too big');
            default:
                throw error;
        }
    }
    if (length.value < 0) {
        throw new Error('String length cannot negative');
    }
    if(buffer.length < offset + length.value + length.usedBytes) {
        throw new Error('String ran out of the buffer');
    }
    const realBuffer = buffer.slice(offset + length.usedBytes, offset + length.usedBytes + length.value);
    const string = realBuffer.toString('utf-8');
    if (string.length > 32767) {
        throw new Error('String is too long');
    }
    return new McString(string, length.usedBytes + length.value);
}

function write(value) {
    if (value.length > 32767) {
        throw new Error('String is too long');
    }
    const stringBuffer = Buffer.from(value, 'utf-8');
    let lengthBuffer
    try {
        lengthBuffer = varInt.write(stringBuffer.length);
    } catch (error) {
        switch (error.message) {
            case "Variable Integer is too big":
                throw new Error('String is too long');
            default:
                throw error;
        }
    }
    return Buffer.concat([lengthBuffer, stringBuffer]);
}

module.exports = {
    read,
    write
}
