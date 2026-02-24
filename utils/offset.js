function calcOffset(offset, length) {
    if (offset < 0) {
        if (length + offset < 0) {
            throw new Error('Offset is out of bounds');
        }
        return length + offset;
    }
    return offset;
}

module.exports = calcOffset;