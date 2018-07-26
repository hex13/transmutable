const mapValues = require('../normalization/mapValues');
const { expect } = require('chai');

describe('mapValues', () => {
    it('should return same object if there is no change', () => {
        const o = {a: {foo: 123}, b: 'boo', c:'coo', d:123, e:false};
        expect(mapValues(o, x=>x)).to.equal(o);
    });
    it('should return a new copied object if there is a change', () => {
        const o = {a: 10, b: 20, c: 30};
        expect(mapValues(o, x => x + 1)).to.deep.equal({a: 11, b: 21, c:31});
    });
    it('should not mutate existing object if there is no change', () => {
        const o = {a: {foo: 123}, b: 'boo', c:'coo', d:123, e:false};
        mapValues(o, x=>x);
        expect(o).to.deep.equal( {a: {foo: 123}, b: 'boo', c:'coo', d:123, e:false});
    });
    it('should not mutate existing object if there is a change', () => {
        const o = {a: 10, b: 20, c: 30};
        mapValues(o, x=>x+1);
        expect(o).to.deep.equal({a: 10, b: 20, c: 30});
    });
});