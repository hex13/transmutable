const assert = require('assert');

const { transform } = require('.');
//const { State } = require('../mea/state');
const { createExample }= require('./testUtils');
const immer = require('immer').default;
const {setAutoFreeze, setUseProxies } = require('immer');



const {benchmarks} = require('./docData');
setAutoFreeze(false);
let max = benchmarks.max;

const original = {
    arr: []
};

const HOW_MANY_OBJECTS_TO_PUSH = 100;
for (let i = 0; i < 1000; i++) {
    original.arr.push({a: i})
}


function transformer(state) {
    // for (let i = 0; i < 100; i++) {
    //     state['o' + i] = Object.assign({}, state.arr[1]);
    // }
    for (let i = 0; i < HOW_MANY_OBJECTS_TO_PUSH; i++) {
        state.arr[i].done = true;
    }
}

function benchmark(code, name) {
    let t0 = Date.now() ;
    let res;
    for (let i = 0; i < max; i++)
        res = code();
    //console.log(original.arr.length, res.arr.length)
    let t1 = Date.now();
    console.log(`* Time for ${name}: `, `${t1 - t0}ms`)
}

console.log(`\nchanging ${HOW_MANY_OBJECTS_TO_PUSH} objects in array of ${original.arr.length} items. Repeated ${max} times.\n`);
console.log('\nES6 Proxies\n');
benchmark(() => {
    return transform(transformer, original);
}, 'transmutable (ES6 - Proxy)')


benchmark(() => {
    return immer(original, transformer);
}, 'immer (ES6 - proxies, without autofreeze)');

console.log("\nES5 fallback\n");
benchmark(() => {
    const P = Proxy;
    Proxy = undefined;
    transform(transformer, original);
    Proxy = P;
}, 'transmutable (ES5 - diffing)')


benchmark(() => {
    setUseProxies(false);
    immer(original, transformer);
    setUseProxies(true);
}, 'immer (ES5 - getters/setters, without autofreeze)');

// benchmark(() => {
//     const state = new State(original);
//     state.run(transformer);
//     return state.get();
// }, 'transmutable (State object)- array')
//

console.log(`\nupdating arbitrary object, one nested update. Repeated ${max} times\n`);
console.log("\nES6 Proxies\n");
benchmark(() => {
    return transform((state) => {
        state.c.d = {};
    }, createExample());
}, 'transmutable (ES6 - proxies)');

benchmark(() => {
    return immer(createExample(), (state) => {
        state.c.d = {};
    });
}, 'immer - (ES6 - proxies, without autofreeze)');

console.log("\nES5 fallback\n");
// TODO tests should be both (ES6 and ES5) for transmutable and immer.

benchmark(() => {
    const P = Proxy;
    Proxy = undefined;
    transform((state) => {
        state.c.d = {};
    }, createExample());
    Proxy = P;
}, 'transmutable (ES5 - diffing) - example')


benchmark(() => {
    setUseProxies(false);
    immer(createExample(), (state) => {
        state.c.d = {};
    });
    setUseProxies(true);
}, 'immer - (ES5 - getters/setters, without autofreeze)')


const state = createExample();
// benchmark(() => {
//
//     const res = Object.assign(
//         {},
//         state,
//         {c: Object.assign({}, state.c, {d: {}})},
//     )
//
//     // const expected = createExample();
//     // expected.c.d = {};
//     // assert.deepStrictEqual(res, expected);
//     return res;
//     // return transform((state) => {
//     //     state.c.d = {};
//     // }, );
// }, 'hand crafted - example')
