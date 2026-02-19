const boolean = require('./parsers/boolean');
const byte = require('./parsers/byte');
const short = require('./parsers/short');
const int = require('./parsers/int');
const long = require('./parsers/long');
const varInt = require('./parsers/varInt');
const varLong = require('./parsers/varLong');



module.exports = {
    boolean,
    byte,
    short,
    int,
    long,
    varInt,
    varLong
}