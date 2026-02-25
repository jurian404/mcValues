const calcOffset = require("../utils/offset");
const McValue = require("../utils/mcValue");

class VarInt extends McValue {
    constructor(value, usedBytes) {
        super(value, usedBytes);
    }
}

function read(buffer, offset = 0) {
    offset = calcOffset(offset, buffer.length);
    const part = getParts(buffer, offset);
    const int = createIntegerFromParts(part);
    return new VarInt(int, part.length);
}

function write(value){
    if(value < -2147483648 || value > 2147483647){
        throw new Error("Value is out of range for VarLong: " + value);
    }
    let isNegative = false;
    const blocks = []
    if (value < 0){
        isNegative = true;
        value = 2147483648 + value;
    }
    do {
        const block = value & 0b1111111;
        blocks.push(block);
        value >>= 7;
    }
    while (value > 0);
    if (isNegative) {
        while (blocks.length < 5){
            blocks.push(0x00);
        }
        blocks[4] = blocks[4] | 0x08;
    }
    for (let i = 0; i < blocks.length - 1; i++) {
        blocks[i] = blocks[i] | 0b10000000;
    }
    return Buffer.from(blocks);
}

function getParts(buffer, offset){
    const bufferLength = buffer.length;
    const byteBlocks = [];
    for (let i = 0; i < 5; i++) {
        if (bufferLength - 1 < i + offset) {
            throw new Error("Variable Integer ran out of the buffer");
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
    read,
    write
}