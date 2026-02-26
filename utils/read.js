const offsetCalc = require("./offset");
const mcValue = require("./mcValue");
const Parser = require("./parser");

class SchemaListValues extends mcValue {
    constructor(values, usedBytes) {
        super(values, usedBytes);
    }

    get value() {
        return super.value.map(part => part.value);
    }

    get parts() {
        return super.value;
    }
}

class SchemaDictValues extends mcValue {
    constructor(values, usedBytes) {
        super(values, usedBytes);
    }

    get value() {
        const result = {}
        for (const key of Object.keys(super.value)) {
            result [key] = super.value[key].value;
        }
        return result;
    }

    get parts() {
        return super.value;
    }
}


function read(buffer, parser, offset = 0) {
    if (!Buffer.isBuffer(buffer)) {
        throw new Error('First argument must be a Buffer.');
    }
    if (Array.isArray(parser)) {
        return readWithList(buffer, parser, offset);
    }
    if (isPlainObject(parser)) {
        return readWithDict(buffer, parser, offset);
    }
    if (typeof parser === "function" && Object.getPrototypeOf(parser) === Parser) {
        return singleParse(buffer, parser, offset);
    }
    throw new TypeError('Unsupported parser');
}

function readWithList(buffer, parsers, offset) {
    offset = offsetCalc(offset, buffer.length);
    const results = [];
    let currentOffset = offset;
    for (const parser of parsers) {
        if (Object.getPrototypeOf(parser) === Parser) {
            const data = parser.read(buffer, currentOffset);
            currentOffset += data.usedBytes;
            results.push(data);
        } else {
            throw new Error('Given data type is not supported.')
        }
    }
    return new SchemaListValues(results, currentOffset - offset);
}

function singleParse(buffer, parser, offset) {
    return parser.read(buffer, offset);
}

function readWithDict(buffer, parsers, offset) {
    const result = {}
    let currentOffset = offset;
    for (const name of Object.keys(parsers)) {
        const parser = parsers[name];
        if (Object.getPrototypeOf(parser) === Parser) {
            const data = parser.read(buffer, currentOffset);
            currentOffset += data.usedBytes;
            result[name] = data;
        } else {
            throw new Error('Given data type is not supported.')
        }
    }
    return new SchemaDictValues(result, currentOffset - offset);
}

function isPlainObject(value) {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        Object.getPrototypeOf(value) === Object.prototype
    );
}

module.exports = read