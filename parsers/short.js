const int = require('./subParser/numbers');
const McValue = require("./mcValue");

class Short extends McValue {
    constructor(value) {
        super(value, 2);
    }
}

function read(buffer, offset = 0){
    return new Short(int.read(buffer, 2, offset));
}

function write(value) {
    return int.write(value, 2);
}

module.exports = {
    read,
    write
}