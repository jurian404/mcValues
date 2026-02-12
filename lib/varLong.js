class VarLong {
    constructor(value, usedBytes) {
        this.__value = value;
        this.__usedBytes = usedBytes;
    }

    [Symbol.toPrimitive]() {
        return this.__value;
    }

    get value() {
        return this.__value;
    }

    get usedBytes() {
        return this.__usedBytes;
    }
}

function readVarLong(buffer, offset = 0) {
    const part = getParts(buffer, offset);
    const int = createIntegerFromParts(part);
    return new VarLong(int, part.length);
}

function getParts(buffer, offset){
    const bufferLength = buffer.length;
    const byteBlocks = [];
    for (let i = 0; i < 9; i++) {
        if (bufferLength - 1 < i + offset) {
            throw new Error("Variable Integer ran out of range");
        }
        const chunk = buffer[offset + i]
        byteBlocks.push(chunk & 0b01111111)
        if (!(chunk & 0b10000000)){
            return {
                byteBlocks: byteBlocks,
                isNegative: false
            };
        }
    }
    if (bufferLength - 11 < offset) {
        throw new Error("Variable Integer ran out of range");
    }
    const chunk = buffer[offset + 9]
    if (chunk === 0x01){
        return {
            byteBlocks: byteBlocks,
            isNegative: true
        }
    }
    if (chunk === 0x00){
        return {
            byteBlocks: byteBlocks,
            isNegative: false
        }
    }
    throw new Error("Variable Integer wasn't correctly finished. The last byte should be either 0x00 or 0x01");
}

function createIntegerFromParts(object){
    const byteBlocks = object.byteBlocks;
    const isNegative = object.isNegative;
    let result = 0n;
    for (let i = 0; i < (byteBlocks.length); i++){
        result |= BigInt(byteBlocks[i]) << (BigInt(i) * 7n);
    }
    if (isNegative){
        result -= 9223372036854775808n;
    }
    return result;
}

module.exports = {
    readVarLong
}