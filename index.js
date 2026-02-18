const varInt = require('./parsers/varInt');
const varLong = require('./parsers/varLong');
const boolean = require('./parsers/boolean');
const byte = require('./parsers/byte');



module.exports = {
    byte,
    varInt,
    varLong,
    boolean
}