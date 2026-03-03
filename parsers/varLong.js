const calcOffset = require("../utils/offset");
const McValue = require("../utils/mcValue");
const Parser = require("../utils/parser");

class VarLong extends McValue {
    constructor(value, usedBytes) {
        super(value, usedBytes);
    }
}

class VarLongParser extends Parser {
    constructor() {
        super();
        throw new Error("This is a static class");
    }

    static read(buffer, offset = 0) {
        if (!Buffer.isBuffer(buffer)) {
            throw new Error("Provided data is not a buffer");
        }
        offset = calcOffset(offset, buffer.length);
        const part = getParts(buffer, offset);
        const int = createIntegerFromParts(part);
        return new VarLong(int, part.isNegative === undefined ? part.byteBlocks.length : part.byteBlocks.length + 1);
    }

    static write(value) {
        if(value < -9223372036854775808n || value > 9223372036854775807n){
            throw new Error("Value is out of range for VarLong: " + value);
        }
        const byteBlocks = [];
        let isNegative = false;
        if (value < 0n){
            isNegative = true;
            value = 9223372036854775808n + value;
        }
        do {
            const part = Number(value & 0b1111111n);
            byteBlocks.push(part);
            value >>= 7n;
        } while (value > 0n);
        for (let i = 0; i < byteBlocks.length - 1; i++) {
            byteBlocks[i] = byteBlocks[i] | 0b10000000;
        }
        if (isNegative) {
            byteBlocks[byteBlocks.length - 1] = byteBlocks[byteBlocks.length - 1] | 0b10000000;
            while (byteBlocks.length < 9){
                byteBlocks.push(0x80);
            }
            byteBlocks.push(0x01);
        }
        return Buffer.from(byteBlocks);
    }
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
                isNegative: undefined
            };
        }
    }
    if (bufferLength - 10 < offset) {
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

module.exports = VarLongParser