'use strict';

const createObjectCache = require('./objectCache');
const mapValues = require('./mapValues');

function normalize(o, getObjectId) {
    if (!getObjectId) {
        let lastId = 0;
        ({ getObjectId } = createObjectCache(() => ++lastId));
    }

    const result = {};

    function visit(node) {
        if (node && typeof node == 'object') {
            const id = getObjectId(node);
            result[id] = mapValues(node, visit);
            return [id];
        }  
            
        return node;
    }
    visit(o);
    return result;
}

module.exports = normalize;