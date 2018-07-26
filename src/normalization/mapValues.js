'use strict';

function mapValues(source, f) {
    const copy = {};
    let wasChanged = false;
    for (let k in source) {
        const original = source[k];
        const mapped = f(original);
        copy[k] = mapped;
        if (mapped !== original) {
            wasChanged = true;
        }
    }
    return wasChanged? copy : source;
}

module.exports = mapValues;