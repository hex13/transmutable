const byId = id => [id];

exports.normalized = {
    "1": {foo: 888, bar: [2], some: [3]},
    "2": {color: 'blue'},
    "3": {deep: [4]},
    "4": {object: [5]},
    "5": {yes: true}
};

exports.Denormalized = () => ({
    foo: 888,
    bar: {
        color: 'blue'
    },
    some: {
        deep: {
            object: {
                yes: true
            }
        }
    }
});

exports.denormalized = exports.Denormalized();

const symbolMap = new Map();
let lastId = 0;
function getKey(symbol) {
    let id = symbolMap.get(symbol);
    if (id) return id;
    id = '@@/symbol/' + (++lastId);
    symbolMap.set(symbol, id);
    return id;
}

function contrast(node) {
    if (node && typeof node == 'object') {
        let contrasted = {};
        let wasChanged = false;
        for (let k in node) {
            contrasted[k] = contrast(node[k]);
            if (contrasted[k] !== node[k]) wasChanged = true;
        }
        if (!wasChanged) contrasted = node;
        const symbols = Object.getOwnPropertySymbols(node);
        for (let i = 0; i < symbols.length; i++) {
            contrasted[getKey(symbols[i])] = contrast(node[symbols[i]])
        }
        return contrasted;
    }
    if (typeof node == 'symbol') return getKey(node);
    return node;
}

exports.contrast = contrast;