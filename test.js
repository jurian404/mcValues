const mcValues = require('./index.js');

const buffer = Buffer.from([0x01, 0x02, 0x03]); // Example buffer
const parsedSchema = mcValues.parseWithSchema(buffer, [
    mcValues.dataTypes.BOOLEAN,
    mcValues.dataTypes.BYTE,
    mcValues.dataTypes.VAR_INT,
]);
console.log(parsedSchema.value); // [true, 2, 3]
console.log(parsedSchema.usedBytes); // 3