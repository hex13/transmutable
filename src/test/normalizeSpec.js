'use strict';

const { expect } = require('chai');

const normalize = require('../normalization/normalize');
const { normalized, denormalized } = require('./testUtils');

describe('', () => {
    it('should normalize', () => {
        const o = denormalized;
        expect(normalize(o)).to.deep.equal(normalized)
    });
    it('should retain exact references', () => {
        const o = denormalized;
        expect(normalize(o)[5]).to.equal(denormalized.some.deep.object);
    })    
});