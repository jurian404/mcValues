# mcValues
This is a simple Node.js module for converting data sent by Minecraft clients to the server into JavaScript values.  
More information about this data can be found in this [Minecraft Wiki article](https://minecraft.wiki/w/Java_Edition_protocol/Packets).

---

## Installation
To install the module, run the following command in your project directory:
```bash
npm install mcvalues
```
---

## Supported Data Types
The module currently supports the following Minecraft data types:
- [VarInt](#varint)
- [VarLong](#varlong)
- [Boolean](#boolean)

More data types will be added in the future, so stay tuned for updates!
Currently, the data types are read-only, but I plan to add writing capabilities later as well.

---

## Usage

### Basic Syntax
To use the module, import it into your project:
```javascript
const mcValues = require('mcvalues');
```
---
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
---

#### Offset
The read method also accepts an optional second argument specifying the offset in the buffer from which to start reading.
If no offset is provided, reading starts from the beginning of the buffer.
```javascript
const buffer = Buffer.from([0x01, 0x02, 0x03]); // Example buffer
const varIntValue = mcValues.varInt.read(buffer, 1); // Start reading from the second byte
```
---

#### Output

The `read` method will return an Object containing the parsed value and the number of bytes read from the buffer.
All the values in the objects are read-only, so you cannot modify them directly.
What datatype will be returned depends on the data type you selected to parse. To check this, read the documentation of the specific data type further down in this README.


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

---
## Data Types

### VarInt

A variable-length integer that represents an integer value in a compact form.
Length: 1–5 bytes

#### Output object:
* **value:** JavaScript number
* **usedBytes:** number between 1 and 5

---

### VarLong

A variable-length long integer that represents a long value in a compact form.
Length: 1–10 bytes

#### Output object:
* **value:** JavaScript bigint
* **usedBytes:** number between 1 and 10

---

### Boolean

A simple true/false value.

#### Output object:
* **value:** JavaScript boolean
* **usedBytes:** always 1

## Disclaimer

This project is not affiliated with, endorsed by, or associated with Mojang Studios or Microsoft. Minecraft is a trademark of Mojang Studios. All related assets, names, and references belong to their respective owners.