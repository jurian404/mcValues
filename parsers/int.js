const int = require('./subParser/numbers');
const McValue = require("./mcValue");

class Int extends McValue {
    constructor(value) {
        super(value, 4);
    }
}

function read(buffer, offset = 0){
    return new Int(int.read(buffer, 4, offset));
}

function write(value) {
    return int.write(value, 4);
}

module.exports = {
    read,
    write
}