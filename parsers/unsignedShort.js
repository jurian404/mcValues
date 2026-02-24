const int = require('./subParser/numbers');
const McValue = require("./mcValue");

class UnsignedShort extends McValue {
    constructor(value) {
        super(value, 2);
    }
}

function read(buffer, offset = 0){
    return new UnsignedShort(int.unsignedRead(buffer, 2, offset));
}

function write(value) {
    return int.unsignedWrite(value, 2);
}

module.exports = {
    read,
    write
}