const mapValues = require('./mapValues');
const denormalize = exports.denormalize = (objects) => {
    const visit = (value) => {
        if (value instanceof Array) {
            const object = objects[value[0]];
            return mapValues(object, visit);
        }
        return value;
        
    }
    return visit([1]);
};

