'use strict';

const { expect } = require('chai');

const { denormalize } = require('../normalization/denormalize');
const { normalized, denormalized } = require('./testUtils');

describe('denormalize', () => {
    it('returns root object ', () => {
        expect(denormalize({
            1: {foo: 'bar'}
        })).to.deep.equal({
            foo: 'bar'
        })
    })    

    it('', () => {
        expect(denormalize({
            1: {foo: [2]},
            2: {bar: true}
        })).to.deep.equal({
            foo: {
                bar: true
            }
        })
    })    

    it('', () => {
        const o = normalized;
        expect(denormalize(o)).to.deep.equal(denormalized)
    })    
});

