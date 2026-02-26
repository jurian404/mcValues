const Parser = require("./parser");

function write(data, datatypes) {
    if (Array.isArray(data) && Array.isArray(datatypes)) {
        return writeWithList(data, datatypes);
    }
    if (isPlainObject(data) && isPlainObject(datatypes)) {
        return writeWithDict(data, datatypes);
    }
    if (typeof datatypes === 'function' && Object.getPrototypeOf(datatypes) === Parser) {
        return singleWrite(data, datatypes);
    }
    throw new TypeError("Writer can't process this inputs")
}

function writeWithList(values, parsers) {
    const results = [];
    for (let i = 0; i < parsers.length; i++) {
        const parser = parsers[i];
        const value = values[i];
        if (Object.getPrototypeOf(parser) !== Parser) {
            throw new Error('Given data type is not supported.')
        }
        if (value === undefined || value === null) {
            throw new Error("Invalid or missing value")
        }
        const data = parser.write(value);
        results.push(data);
    }
    return Buffer.concat(results);
}

function singleWrite(value, parser) {
    return parser.write(value);
}

function writeWithDict(values, parsers) {
    const results = [];
    for (const name of Object.keys(parsers)) {
        const parser = parsers[name];
        const value = values[name];
        if (Object.getPrototypeOf(parser) !== Parser) {
            throw new Error('Given data type is not supported.')
        }
        if (value === undefined || value === null) {
            throw new Error("Invalid or missing value")
        }
        results.push(parser.write(value));
    }
    return Buffer.concat(results);
}

function isPlainObject(value) {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        Object.getPrototypeOf(value) === Object.prototype
    );
}

module.exports = write