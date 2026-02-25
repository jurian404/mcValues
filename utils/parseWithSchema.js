const offsetCalc = require('./offset');
const mcValue = require('./mcValue');
const dataTypes = require('../datatypes.json');
const boolean = require('../parsers/boolean');
const byte = require('../parsers/byte');
const short = require('../parsers/short');
const int = require('../parsers/int');
const long = require('../parsers/long');
const varInt = require('../parsers/varInt');
const varLong = require('../parsers/varLong');
const unsignedByte = require('../parsers/unsignedByte');
const unsignedShort = require('../parsers/unsignedShort');
const string = require('../parsers/string');


class SchemaValues extends mcValue {
    constructor(values, usedBytes) {
        super(values, usedBytes);
    }
}

function parseWithSchema(buffer, schema, offset = 0) {
    offset = offsetCalc(offset, buffer.length);
    const results = [];
    let currentOffset = offset;
    for (const dataType of schema) {
        let parser;
        switch (dataType) {
            case dataTypes.BOOLEAN:
                parser = boolean;
                break;
            case dataTypes.BYTE:
                parser = byte;
                break;
            case dataTypes.SHORT:
                parser = short;
                break;
            case dataTypes.INT:
                parser = int;
                break;
            case dataTypes.LONG:
                parser = long;
                break;
            case dataTypes.VAR_INT:
                parser = varInt;
                break;
            case dataTypes.VAR_LONG:
                parser = varLong;
                break;
            case dataTypes.UNSIGNED_BYTE:
                parser = unsignedByte;
                break;
            case dataTypes.UNSIGNED_SHORT:
                parser = unsignedShort;
                break;
            case dataTypes.STRING:
                parser = string;
                break;
            default:
                throw new Error('Given data type is not supported.');
        }
        const data = parser.read(buffer, currentOffset);
        currentOffset += data.usedBytes;
        results.push(data.value);
    }
    return new SchemaValues(results, currentOffset - offset);
}

module.exports = parseWithSchema;