const { contrast } = require('./testUtils');
const { expect } = require('chai');

describe('contrast', () => {
    it('should replace symbols with unique strings', () => {
        const A = Symbol();
        const B = Symbol();
        const a = contrast(A);
        const b = contrast(B);
        const a2 = contrast(A);
        const a3 = contrast(A);
        const b2 = contrast(B);
        expect(typeof a).to.equal('string');
        expect(typeof b).to.equal('string');
        expect(typeof a2).to.equal('string');
        expect(typeof a3).to.equal('string');
        expect(typeof b2).to.equal('string');
        expect(a).to.equal(a2);
        expect(a).to.equal(a2);
        expect(a).to.equal(a3);
        expect(a).to.not.equal(b);
        expect(a).to.not.equal(b2);
        expect(b).to.equal(b2);

        expect(contrast({
            foo: {
                bar: A
            },
            foo2: B,
            c: 'cat',
            d: {
                dog: true
            },
            here: {
                itIs: B
            },
            o: A
        })).to.deep.equal({
            foo: {
                bar: a
            },
            foo2: b,
            c: 'cat',
            d: {
                dog: true
            },
            here: {
                itIs: b
            },
            o: a
        })
    });
});