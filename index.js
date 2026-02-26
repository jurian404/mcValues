const boolean = require('./parsers/boolean');
const byte = require('./parsers/byte');
const short = require('./parsers/short');
const int = require('./parsers/int');
const long = require('./parsers/long');
const varInt = require('./parsers/varInt');
const varLong = require('./parsers/varLong');
const unsignedByte = require('./parsers/unsignedByte');
const unsignedShort = require('./parsers/unsignedShort');
const string = require('./parsers/string');
const read = require('./utils/read');
const write = require('./utils/write');

module.exports = {
    boolean,
    byte,
    short,
    int,
    long,
    varInt,
    varLong,
    unsignedByte,
    unsignedShort,
    string,
    read,
    write
}