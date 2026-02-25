const int = require('./subParser/numbers');
const McValue = require("../utils/mcValue");

class Byte extends McValue {
    constructor(value) {
        super(value, 1);
    }
}

function read(buffer, offset = 0){
    return new Byte(int.read(buffer, 1, offset));
}

function write(value) {
    return int.write(value, 1);
}

module.exports = {
    read,
    write
}