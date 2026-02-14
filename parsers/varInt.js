class VarInt {
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
    const part = getParts(buffer, offset);
    const int = createIntegerFromParts(part);
    return new VarInt(int, part.length);
}

function getParts(buffer, offset){
    const bufferLength = buffer.length;
    const byteBlocks = [];
    for (let i = 0; i < 5; i++) {
        if (bufferLength - 1 < i + offset) {
            throw new Error("Variable Integer ran out of range");
        }
        const chunk = buffer[offset + i]
        byteBlocks.push(chunk & 0b01111111)
        if (!(chunk & 0b10000000)){
            return byteBlocks;
        }
    }
    throw new Error("Variable Integer wasn't correctly finished. Is it maybe a VarLong?");
}

function createIntegerFromParts(byteBlocks){
    let result = 0;
    for (let i = 0; i < (byteBlocks.length); i++){
        result |= byteBlocks[i] << (i * 7);
    }
    return result;
}


module.exports = {
    read
}