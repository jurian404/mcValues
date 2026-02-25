const int = require('./subParser/bigInt');
const McValue = require("../utils/mcValue");

class Long extends McValue {
    constructor(value) {
        super(value, 8);
    }
}

function read(buffer, offset = 0){
    return new Long(int.read(buffer, 8, offset));
}

function write(value) {
    return int.write(value, 8);
}

module.exports = {
    read,
    write
}