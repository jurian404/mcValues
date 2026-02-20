function read(buffer, length, offset){
    if (buffer.length < length + offset){
        throw new Error("Ran out of buffer");
    }
    let number = 0n;
    for (let i = 0; i < length; i++) {
        number <<= 8n;
        number |= BigInt(buffer[offset + i]);
    }
    //check negative
    if (number >> BigInt(8 * length - 1)){
        number ^= 0b1n << BigInt(8 * length - 1);
        number = -(2n ** BigInt(8 * length -1)) + number;
    }
    return number;
}

function write(number, length) {
    if(number < -(2n ** BigInt(8 * length -1)) || number > 2n ** BigInt(8 * length -1) - 1n){
        throw new Error("Value is out of range: " + number);
    }
    let isNegative = false;
    const blocks = []
    if (number < 0n) {
        isNegative = true;
        number =  2n ** BigInt(8 * length -1) + number;
    }
    for (let i = length - 1; i >= 0; i--) {
        const block = Number((number >> BigInt(8 * i)) & 0xffn);
        blocks.push(block);
    }
    if (isNegative) {
        blocks[0] = blocks[0] | 0x80;
    }
    return Buffer.from(blocks);
}

module.exports = {
    read,
    write
}
