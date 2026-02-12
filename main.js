const varLong = require('./lib/varLong');

const buffer = new Uint16Array(20);
buffer[0] = 0x80;
buffer[1] = 0x80;
buffer[2] = 0x80;
buffer[3] = 0x80;

buffer[4] = 0x80;
buffer[5] = 0x80;
buffer[6] = 0x80;
buffer[7] = 0x80;

buffer[8] = 0x80;
buffer[9] = 0x01;

const finalBuffer = Buffer.from(buffer);
const result = varLong.readVarLong(finalBuffer, 0).value;
printBinary(result);
console.log(result);



function printBinary(num){
    function chunkString(str, size) {
        const result = [];
        for (let i = 0; i < str.length; i += size) {
            result.push(str.slice(i, i + size));
        }
        return result;
    }

    const binary = chunkString(num.toString(2).padStart(80, "0"), 8).join(".");
    const hex = chunkString(num.toString(16).padStart(30, "0"), 2).join(".");
    const number = chunkString(num.toString().padStart(2, "0"), 3).join(" ");
    console.log("Bin:", binary);
    console.log("Dec:", number);
    console.log("Hex:", hex);
}
