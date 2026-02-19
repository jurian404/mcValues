function read(buffer, length, offset){
    if (buffer.length < length + offset){
        throw new Error("Ran out of buffer");
    }
    let number = 0;
    for (let i = 0; i < length; i++) {
        number <<= 8;
        number |= buffer[offset + i];
    }
    //check negative
    if (number >> (8 * length - 1)){
        number ^= 0b1 << (8 * length - 1);
        number = -(2 **(8 * length -1)) + number;
    }
    return number;
}

function write(number, length) {
    if(number < -(2 ** (8 * length -1)) || number > 2 ** (8 * length -1) - 1){
        throw new Error("Value is out of range for VarLong: " + number);
    }
    let isNegative = false;
    const blocks = []
    if (number < 0) {
        isNegative = true;
        number =  2 ** (8 * length -1) + number;
    }
    for (let i = length - 1; i >= 0; i--) {
        const block = (number >> (8 * i)) & 0xff;
        blocks.push(block);
    }
    if (isNegative) {
        blocks[0] = blocks[0] | 0x80;
    }
    return Buffer.from(blocks);
}

module.exports = {
    read,
    write,
}
