# mcValues
This is a simple Node.js module for converting data sent by Minecraft clients to the server into JavaScript values.  
More information about this data can be found in this [Minecraft Wiki article](https://minecraft.wiki/w/Java_Edition_protocol/Packets).


## Installation
To install the module, run the following command in your project directory:
```bash
npm install mcvalues
```

## Supported Data Types
The module currently supports the following Minecraft data types:
- [Boolean](#boolean)
- [String](#string)
- [Byte](#byte)
- [Unsigned Byte](#unsigned-byte)
- [Short](#short)
- [Unsigned Short](#unsigned-short)
- [Int](#int)
- [Long](#long)
- [VarInt](#varint)
- [VarLong](#varlong)

> More data types will be added in the future, so stay tuned for updates!

## Usage

### Basic Syntax for single data type
To use the module, import it into your project:
```javascript
const mcValues = require('mcvalues');
```
### Parsing Values
To parse a value from a Buffer, first select the data type you want to parse by accessing the corresponding property of the mcValues object:
```javascript
mcValues.varInt; // to parse a VarInt
mcValues.varLong; // to parse a VarLong
//...
```
Then call the read method of the selected data type. It takes a Buffer as an argument and returns the parsed value.
```javascript
const buffer = Buffer.from([0x01, 0x02, 0x03]); // Example buffer
const varIntValue = mcValues.varInt.read(buffer);
```

#### Offset
The read method also accepts an optional second argument specifying the offset in the buffer from which to start reading.
If no offset is provided, reading starts from the beginning of the buffer.
If a negative offset is provided, it will be treated as an offset from the end of the buffer (the offset refers to the first byte used for parsing, not the last byte).
```javascript
const buffer = Buffer.from([0x01, 0x02, 0x03]); // Example buffer
const varIntValue = mcValues.varInt.read(buffer, 1); // Start reading from the second byte
```

#### Output

The `read` method will return an Object that is a child of the `McValue` class, which contains the following read-only properties:
* **value:** The JavaScript value that was parsed from the buffer.
* **usedBytes:** The number of bytes that were read from the buffer to parse the value.

Depending on the data type being parsed, the `value` property will be of a different JavaScript type (e.g., boolean, number, bigint, string).
Which type is returned will be specified in the documentation for each data type below.
Every Object can have additional methods and properties that are specific to the data type being parsed.
If there are any additional methods or properties, they will also be documented in the section for that data type.

Example:
```javascript
const mcValues = require('./index');

const buffer = Buffer.from([0x01, 0x02, 0x03]); // Example buffer
const varIntValue = mcValues.varInt.read(buffer);
console.log(varIntValue); // VarInt {}
```
To read the data from the object, you can use the `value` and the `usedBytes` properties of the returned object.
```javascript
console.log(varIntValue.value); // 1
console.log(varIntValue.usedBytes); // 1
```

If you use the object in a context where a primitive value is expected, it will automatically return the `value` property of the object.
```javascript
console.log(varIntValue + 3); // 4
```
This means that you can use the returned object directly in mathematical and logical operations without having to access the `value` property explicitly.

### Writing Values
The module also provides a `write` method for each data type, which allows you to convert a JavaScript value back into a Buffer that can be sent to the Minecraft Client or server.
To use the `write` method, simply call it with the JavaScript value you want to convert:
```javascript
const varIntBuffer = mcValues.varInt.write(123); // Convert the number 123 to a VarInt buffer
```

#### Output
The `write` method will return a Buffer containing the bytes that represent the given JavaScript value in the Minecraft data format.
The length of the buffer will depend on the value being converted and the data type being used.


### Basic Syntax for multiple data types
If you want to parse multiple values behind each other in the same buffer, you can use the `parseWithSchema` method of the `mcValues` object.
The `parseWithSchema` method takes a Buffer and an array of data types as arguments and returns an array of parsed values.
To select the data types, use the datatypes from the `mcValues.dataTypes` enum:
```javascript
const buffer = Buffer.from([0x01, 0x02, 0x03]); // Example buffer
const parsedSchema = mcValues.parseWithSchema(buffer, [
    mcValues.dataTypes.BOOLEAN,
    mcValues.dataTypes.BYTE,
    mcValues.dataTypes.VAR_INT,
]);
console.log(parsedSchema.value); // [true, 2, 3]
console.log(parsedSchema.usedBytes); // 3
```

You can also specify an offset from which to start parsing the buffer by providing a third argument to the `parseWithSchema` method:
```javascript
const buffer = Buffer.from([0x00, 0x01, 0x02, 0x03]); // Example buffer
const parsedSchema = mcValues.parseWithSchema(buffer, [
    mcValues.dataTypes.BOOLEAN,
    mcValues.dataTypes.BYTE,
    mcValues.dataTypes.VAR_INT,
], 1); // Start parsing from the second byte
console.log(parsedSchema.value); // [true, 2, 3]
console.log(parsedSchema.usedBytes); // 3
```
All the values parsed with the `parseWithSchema` method will be returned as an array in the `value` property of the returned object, and the total number of bytes used to parse all the values will be returned in the `usedBytes` property.

## Data Types

### Boolean

A simple true/false value.

#### Parsing:
Will return a `Boolean` object with the following properties:
* **value:** JavaScript boolean
* **usedBytes:** always 1

#### Writing:
* **Input:** JavaScript boolean
* **Output:** Buffer with a length of 1 byte

---

### String
A string of characters that represents text data.
Length: Depends on the length of the string and the encoding used.

#### Parsing:
Will return a `McString` object with the following properties:
* **value:** JavaScript string
* **usedBytes:** number of bytes used to represent the string in the buffer

#### Writing:
* **Input:** JavaScript string
* **Output:** Buffer containing the bytes that represent the string in the Minecraft data format

---

### Byte

A single byte that represents a signed integer value between -128 and 127.
Length: 1 byte

#### Parsing:
Will return a `Byte` object with the following properties:
* **value:** JavaScript number
* **usedBytes:** always 1

#### Writing:
* **Input:** JavaScript number
* **Output:** Buffer with a length of 1 byte

---

### Unsigned Byte
A single byte that represents an unsigned integer value between 0 and 255.
Length: 1 byte

#### Parsing:
Will return an `UnsignedByte` object with the following properties:
* **value:** JavaScript number
* **usedBytes:** always 1

#### Writing:
* **Input:** JavaScript number
* **Output:** Buffer with a length of 1 byte

---

### Short

A two-byte signed integer value between -32.768 and 32.767.
Length: 2 bytes

#### Parsing:
Will return a `Short` object with the following properties:
* **value:** JavaScript number
* **usedBytes:** always 2

#### Writing:
* **Input:** JavaScript number
* **Output:** Buffer with a length of 2 bytes

---

### Unsigned Short
A two-byte unsigned integer value between 0 and 65.535.
Length: 2 bytes

#### Parsing:
Will return an `UnsignedShort` object with the following properties:
* **value:** JavaScript number
* **usedBytes:** always 2

#### Writing:
* **Input:** JavaScript number
* **Output:** Buffer with a length of 2 bytes

---

### Int
A four-byte signed integer value between -2.147.483.648 and 2.147.483.647.
Length: 4 bytes

#### Parsing:
Will return an `Int` object with the following properties:
* **value:** JavaScript number
* **usedBytes:** always 4

#### Writing:
* **Input:** JavaScript number
* **Output:** Buffer with a length of 4 bytes

---

### Long
An eight-byte signed integer value between -9.223.372.036.854.775808 and 9.223.372.036.854.775807.
Length: 8 bytes

#### Parsing:
Will return a `Long` object with the following properties:
* **value:** JavaScript bigint
* **usedBytes:** always 8

#### Writing:
* **Input:** JavaScript bigint
* **Output:** Buffer with a length of 8 bytes

---

### VarInt
A variable-length integer that represents an integer value in a compact form.
Length: 1–5 bytes

#### Parsing:
Will return a `VarInt` object with the following properties:
* **value:** JavaScript number
* **usedBytes:** number between 1 and 5

#### Writing:
* **Input:** JavaScript number
* **Output:** Buffer with a length between 1 and 5 bytes

---

### VarLong

A variable-length long integer that represents a long value in a compact form.
Length: 1–10 bytes

#### Parsing:
Will return a `VarLong` object with the following properties:
* **value:** JavaScript bigint
* **usedBytes:** number between 1 and 10

#### Writing:
* **Input:** JavaScript bigint
* **Output:** Buffer with a length between 1 and 10 bytes

## Disclaimer

This project is not affiliated with, endorsed by, or associated with Mojang Studios or Microsoft. Minecraft is a trademark of Mojang Studios. All related assets, names, and references belong to their respective owners.

> If you have any questions, suggestions, or want to contribute to the project, feel free to open an issue or submit a pull request on GitHub. Your feedback is greatly appreciated!