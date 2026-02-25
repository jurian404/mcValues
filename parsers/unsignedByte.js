const int = require('./subParser/numbers');
const McValue = require("../utils/mcValue");

class UnsignedByte extends McValue {
    constructor(value) {
        super(value, 1);
    }
}

function read(buffer, offset = 0){
    return new UnsignedByte(int.unsignedRead(buffer, 1, offset));
}

function write(value) {
    return int.unsignedWrite(value, 1);
}

module.exports = {
    read,
    write
}