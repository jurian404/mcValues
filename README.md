# mcValues
This is a simple Node.js module for converting data to and from Minecraft's binary format.
More information about this data can be found in this [Minecraft Wiki article](https://minecraft.wiki/w/Java_Edition_protocol/Packets).


## Overview
- [Installation](#installation)
- [Supported Data Types](#supported-data-types)
- [Reading Data](#read-minecraft-binary-data)
- [Writing Data](#write-minecraft-binary-data)
- [McValues Class & Schemas](#mcvalues-class)
- [Offset](#offset)
- [Supported Data Types](#datatypes)
- [Disclaimer](#disclaimer)


## Installation
To install the module, run the following command in your project directory:
```bash
npm install mcvalues
```

Import the module in your JavaScript where you want to use it:
```javascript
const mcValues = require('mcvalues');
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

## Read minecraft binary data
You have two options for reading Minecraft binary data:
1. Use a datatype-specific read function.
2. Use the generic `read` function.

### 1. Datatype-specific read method
Each datatype parser has a `read` method that takes a `Buffer` and an optional [offset](#offset) as arguments.
You read data by following this syntax:
```javascript
const result = mcValues.dataType.read(buffer, offset);
```

Which datatype parser you have to use will depend on the data type you want to read.
You can find that in the [documentation for specific data types](#datatypes) under _"Parser/Writer Class"_.

Example usage:
```javascript
const mcValues = require('mcvalues');
const buffer = Buffer.from([0x01]); // Example buffer containing a boolean value (true)
const result = mcValues.boolean.read(buffer);
```

The result of the read method will be an instance of the corresponding data type class.
You can find more information about that classes under [McValues Class](#mcvalues-class).

### 2. Generic read method
The module also provides a generic `read` method that can be used to read single values or multiple values from a buffer.

#### Single value
To read a single value, you can use the `read` function with the following syntax:
```javascript
const result = mcValues.read(buffer, mcValues.dataType, offset);
```
It takes a `Buffer`, the data type parser (e.g., `mcValues.boolean`), and an optional [offset](#offset) as arguments.
Which data type parser you have to use is explained in the [documentation for specific data types](#datatypes) under _"Parser/Writer Class"_.

For example, if you want to read a boolean value, you would use:
```javascript
const buffer = Buffer.from([0x01]); // Example buffer containing a boolean value (true)
const result = mcValues.read(buffer, mcValues.boolean);
```
The result of the read method will be an instance of the corresponding data type class.
You can find more information about that classes under [McValues Class](#mcvalues-class).
#### List of values
To read a list of values, you can use the `read` function with the following syntax:
```javascript
const result = mcValues.read(buffer, [mcValues.dataType1, mcValues.dataType2, ...], offset);
```
It takes a `Buffer`, an array of data type parsers (e.g., `[mcValues.boolean, mcValues.string]`), and an optional [offset](#offset) as arguments.
The function will read the values in the order they are specified in the array.
For example, if you want to read a boolean followed by a varint, you would use:
```javascript
const buffer = Buffer.from([0x01, 0x05]); // Example buffer containing a boolean value (true) followed by a varint (5)
const result = mcValues.read(buffer, [mcValues.boolean, mcValues.varInt]);
```
The read value then will return an instance of the [SchemaListValues](#schemalistvalues-class) class.
Continuing with the example above, the result would look like this:
```javascript
result.value; // [true, 5]
result.usedBytes; // 2
result.parts; // [McBoolean { value: true, usedBytes: 1 }, McVarInt { value: 5, usedBytes: 1 }]
```
---
#### Dictionary of values
To get a dictionary of values, you can use the `read` function with the following syntax:
```javascript
const result = mcValues.read(buffer, { key1: mcValues.dataType1, key2: mcValues.dataType2, ... }, offset);
```
It takes a `Buffer`, an object where the keys are the names of the values you want to read and the values are the corresponding data type parsers.
The function will read the values in the order they are specified in the object.

For example, if you want to read a boolean followed by a varint, you would use:
```javascript
const buffer = Buffer.from([0x01, 0x05]); // Example buffer containing a boolean value (true) followed by a varint (5)
const result = mcValues.read(buffer, { isActive: mcValues.boolean, count: mcValues.varInt });
```

The read value then will return an instance of the [SchemaDictValues](#schemadictvalues-class) class.
Continuing with the example above, the result would look like this:
```javascript
result.value; // { isActive: true, count: 5 }
result.usedBytes; // 2
result.parts; // { isActive: McBoolean {}, count: McVarInt {} }
```

## Write Minecraft Binary Data
The module also provides methods for writing data to a buffer in Minecraft's binary format.
There are also two options for writing data:
1. Use a datatype-specific write function.
2. Use the generic `write` function.

### 1. Datatype-specific write method
Each datatype parser has a `write` method that takes a value and an optional [offset](#offset) as arguments.
You write data by following this syntax:
```javascript
const buffer = mcValues.dataType.write(value, offset);
```
Which datatype parser you have to use will depend on the data type you want to write.
You can find that in the [documentation for specific data types](#datatypes) under _"Parser/Writer Class"_.
Example usage:
```javascript
const mcValues = require('mcvalues');
const value = true; // Example boolean value to write
const buffer = mcValues.boolean.write(value);
```
The result of the write method will be a `Buffer` containing the binary data in Minecraft's format.
You can find the expected value and buffer size for each data type in the [documentation for specific data types](#datatypes) under _"Returned / Required Value"_ and _"Buffer Size"_.

### 2. Generic write method
The module also provides a generic `write` method that can be used to write single values or multiple values to a buffer.
#### Single value
To write a single value, you can use the `write` function with the following syntax:
```javascript
const buffer = mcValues.write(value, mcValues.dataType, offset);
```
It takes a value and the data type parser (e.g., `mcValues.boolean`).
Which data type parser you have to use is explained in the [documentation for specific data types](#datatypes) under _"Parser/Writer Class"_.
For example, if you want to write a boolean value, you would use:
```javascript
const value = true; // Example boolean value to write
const buffer = mcValues.write(value, mcValues.boolean);
```
The result of the write method will be a `Buffer` containing the binary data in Minecraft's format.

#### List of values
To write a list of values, you can use the `write` function with the following syntax:
```javascript
const buffer = mcValues.write([value1, value2, ...], [mcValues.dataType1, mcValues.dataType2, ...], offset);
```
It takes an array of values and an array of data type parsers (e.g., `[mcValues.boolean, mcValues.string]`).
The function will write the values in the order they are specified in the array.
For example, if you want to write a boolean followed by a varint, you would use:
```javascript
const values = [true, 5]; // Example values to write
const buffer = mcValues.write(values, [mcValues.boolean, mcValues.varInt]);
```
The result of the write method will be a `Buffer` containing the binary data in Minecraft's format.

#### Dictionary of values
To write a dictionary of values, you can use the `write` function with the following syntax:
```javascript
const buffer = mcValues.write({ key1: value1, key2: value2, ... }, { key1: mcValues.dataType1, key2: mcValues.dataType2, ... }, offset);
```
It takes an object where the keys are the names of the values you want to write and the values are the corresponding data type parsers.
The function will write the values in the order they are specified in the object.
The keys in the object of values and the keys in the object of data type parsers must match.
For example, if you want to write a boolean followed by a varint, you would use:
```javascript
const values = { isActive: true, count: 5 }; // Example values to write
const buffer = mcValues.write(values, { isActive: mcValues.boolean, count: mcValues.varInt });
```
The result of the write method will be a `Buffer` containing the binary data in Minecraft's format.

## McValues Class
All the values returned by the read methods will be instances of their respective classes (e.g., `McBoolean`, `McString`, etc.).
All these classes are child classes of the `McValues` base class, which provides common functionality for all data types.
This generic functionality will be explained here.

### SchemaListValues Class
When you use the generic `read` method to read a list of values, the result will be an instance of the `SchemaListValues` class.
This class is a child class of `McValues` and has the following properties:
- `value`: An array containing the primitive values read from the buffer, in the order they were specified in the array of data type parsers.
- `usedBytes`: The total number of bytes that were read from the buffer to obtain all the values.
- `parts`: An array containing the individual `McValues` instances for each value read from the buffer, in the order they were specified in the array of data type parsers.

### SchemaDictValues Class
When you use the generic `read` method to read a dictionary of values, the result will be an instance of the `SchemaDictValues` class.
This class is a child class of `McValues` and has the following properties:
- `value`: An object containing a key-value pair for each value read from the buffer, paired with the corresponding key specified in the object of data type parsers.
- `usedBytes`: The total number of bytes that were read from the buffer to obtain all the values.
- `parts`: An object containing the individual `McValues` instances for each value read from the buffer, paired with the corresponding key specified in the object of data type parsers.


### Common functionality for all data types
All datatypes will have 2 read-only properties:
- `value`: The actual value read from the buffer, converted to the appropriate JavaScript type (e.g., boolean, string, number, etc.).\
  What this value is will depends on the data type being read. \
  You can find it in the [documentation for your specific data type](#datatypes) under _"Returned / Required Value"_.
- `usedBytes`: The number of bytes that were read from the buffer to obtain the value.
  What this value is will depend on the data type being read. \
  You can find it in the [documentation for your specific data type](#datatypes) under _"Buffer Size"_.


The `McValues` class is a base class that provides common functionality for all data types.
Each specific data type can have its own child class that extends `McValues`.
You can find the specific data type classes and their properties in the [Datatypes](#datatypes) section below _"Data Type Class"_.

## Offset
In all the read methods, the `offset` parameter is optional and defaults to `0` if not provided.
The `offset` specifies the number of bytes to skip from the beginning of the buffer before starting to read the data.
This can be useful when you want to read multiple values from the same buffer, or when the data you want to read is not at the beginning of the buffer.

Example usage:
```javascript
const buffer = Buffer.from([0x00, 0x01]); // Example buffer where the first byte is a padding byte and the second byte contains a boolean value (true)
const result = mcValues.boolean.read(buffer, 1); // Start reading from the second byte (offset of 1)
```

If you provide a negative offset, it will be treated as an offset from the end of the buffer.
The offset will, reference the position of the first byte of the data to be read, not the last byte.
Example usage:
```javascript
const buffer = Buffer.from([0x01, 0x00]); // Example buffer where the first byte contains a boolean value (true) and the second byte is a padding byte
const result = mcValues.boolean.read(buffer, -1); // Start reading from the last byte (offset of -1)
```

## Datatypes
Here's a list of the currently supported data types and their corresponding information:

### Boolean
- **Description**: Represents a boolean value (true or false).
- **Buffer Size**: 1 byte
- **Javascript Value**: `true` or `false`
- **Parser/Writer Class**: `mcValues.boolean`
- **Data Type Class**: `McBoolean`
    - This class has no additional properties

### String
- **Description**: Represents a utf-8 string
- **Buffer Size**: Variable (depends on the length of the string)
- **Javascript Value**: A JavaScript string
- **Parser/Writer Class**: `mcValues.string`
- **Data Type Class**: `McString`
    - This class has no additional properties

### Byte
- **Description**: Represents a signed byte value.
- **Buffer Size**: 1 byte
- **Javascript Value**: A number between -128 and 127
- **Parser/Writer Class**: `mcValues.byte`
- **Data Type Class**: `Byte`
    - This class has no additional properties

### Unsigned Byte
- **Description**: Represents an unsigned byte value.
- **Buffer Size**: 1 byte
- **Javascript Value**: A number between 0 and 255
- **Parser/Writer Class**: `mcValues.unsignedByte`
- **Data Type Class**: `UnsignedByte`
    - This class has no additional properties

### Short
- **Description**: Represents a signed short value.
- **Buffer Size**: 2 bytes
- **Javascript Value**: A number between -32 768 and 32 767
- **Parser/Writer Class**: `mcValues.short`
- **Data Type Class**: `Short`
    - This class has no additional properties

### Unsigned Short
- **Description**: Represents an unsigned short value.
- **Buffer Size**: 2 bytes
- **Javascript Value**: A number between 0 and 65 535
- **Parser/Writer Class**: `mcValues.unsignedShort`
- **Data Type Class**: `UnsignedShort`
    - This class has no additional properties

### Int
- **Description**: Represents a signed integer value.
- **Buffer Size**: 4 bytes
- **Javascript Value**: A number between -2 147 483 648 and 2 147 483 647
- **Parser/Writer Class**: `mcValues.int`
- **Data Type Class**: `Int`
    - This class has no additional properties

### VarInt
- **Description**: Represents a variable-length integer value.
- **Buffer Size**: Variable between 1 and 5 bytes (depends on the value being read/written)
- **Javascript Value**: A number between -2 147 483 648 and 2 147 483 647
- **Parser/Writer Class**: `mcValues.varInt`
- **Data Type Class**: `VarInt`
    - This class has no additional properties

### Long
- **Description**: Represents a signed long value.
- **Buffer Size**: 8 bytes
- **Javascript Value**: A number between -9 223 372 036 854 775 808 and 9 223 372 036 854 775 807
- **Parser/Writer Class**: `mcValues.long`
- **Data Type Class**: `Long`
    - This class has no additional properties

### VarLong
- **Description**: Represents a variable-length long value.
- **Buffer Size**: Variable between 1 and 10 bytes (depends on the value being read/written)
- **Javascript Value**: A number between -9 223 372 036 854 775 808 and 9 223 372 036 854 775 807
- **Parser/Writer Class**: `mcValues.varLong`
- **Data Type Class**: `VarLong`
    - This class has no additional properties

## Disclaimer
This project is not affiliated with, endorsed by, or associated with Mojang Studios or Microsoft. Minecraft is a trademark of Mojang Studios. All related assets, names, and references belong to their respective owners.

> If you have any questions, suggestions, or want to contribute to the project, feel free to open an issue or submit a pull request on GitHub. Your feedback is greatly appreciated!