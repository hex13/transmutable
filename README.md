### Transmutable - immutable objects that pretend to be mutable

![logo: on left there is a red circle
 (representing original state). On right there are two circles: red (because original state is the same before and after), and a blue one (new state derived from first one)](https://raw.githubusercontent.com/hex13/transmutable/master/logo.svg?sanitize=true)

Transmutable is a small library (4.85kB) which allows to write immutable code in a way which is very similar to writing mutable code.

Instead of using object spread (`...`) or `Object.assign` you just call `transform` with your transforming function as an argument. Your function will get `draft`, i.e. special Proxy object (or just a copy of state, if ES6 Proxies aren't available). Then you can "mutate" your draft object.

Example:
```javascript
const copy = transform(draft => {
    draft.some.object.animal = 'dog';
}, original);

```

After that Transmutable will go through your mutations and will make automatically a new object derived from previous object + mutations you have provided. Things your modify will be copied with changes applied to the copy, things you didn't touch will be copied just by reference (structural sharing) so you don't lose your immutable references.

![screenshot](https://raw.githubusercontent.com/hex13/transmutable/master/screenshot-transmutable.png)

It allows for reducing of boilerplate traditionally associated with writing immutable code in JavaScript (especially in libraries like Redux).

Transmutable is based on idea that immutability should not come at the cost of developer experience.

So instead of forcing user to manually copying objects with `Object.assign` / `...`, it leaves this part to the library. The library presents you a `draft` (proxy object which records your mutations and creates some kind of patch).

Then the patch is applied and you have effect similar to updating your state with `...` or `Object.assign` but handled automatically, without boilerplate.

### Usage

* [back to top](#transmutable---immutable-objects-that-pretend-to-be-mutable)
* [API](#api)
    * [transform](#transform)
    * [transformAt](#transformat)
* [integrations](#integrations)
    * [with Redux](#with-redux)
* [performance](#performance)
* [comparison with other libraries](#comparison-with-other-libraries)
* [gotchas](#gotchas)



## API
### transform

```javascript
const { transform, transformAt } = require('transmutable');

const original = {a: 123};

const copy = transform(draft => {
	draft.a = 456;
}, original);

console.log({original, copy});
// { original: { a: 123 }, copy: { a: 456 } }

```

or you could use also `this` variable:

```javascript
const copy = transform(function () {
	this.a = 456;
}, original);
```
Notice that `this` won't work with [arrow-functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) because they just don't have `this` at all.


### transformAt

`transformAt` for applying changes only in the slice of state (concept similar to functional lenses):

```javascript
const original = {
	some: {
		deep: {
			object: {
				foo: 123,
				bar: 'hello'
			}
		}
	}
}
const copy = transformAt(['some', 'deep', 'object'], d => {
    d.foo = 456;
    d.bar += ' world';
}, original);
```

Result will be:

```javascript
{
	some: {
		deep: {
			object: {
				foo: 456,
				bar: 'hello world'
			}
		}
	}
}
```

## integrations

### with Redux:

```javascript
const { transform } = require('transmutable');
const { createStore } = require('redux');

// when transform gets only one argument it returns curried function
const reducer = transform((state, action) => {
	switch (action.type) {
		case 'inc':
			state.counter++;
			break;
		case 'concat':
			state.text += action.text;
			break;
	}
});
const initialState = {counter: 1, text: ''};
const store = createStore(reducer, initialState);

store.dispatch({type: 'inc'});
store.dispatch({type: 'inc'});
store.dispatch({type: 'inc'});
store.dispatch({type: 'concat', text: 'Hello'});
store.dispatch({type: 'concat', text: ' '});
store.dispatch({type: 'concat', text: 'world'});

assert.deepStrictEqual(
	store.getState(),
	{counter: 4, text: 'Hello world'}
);
// initial state has not changed :)
assert.deepStrictEqual(initialState, {counter: 1, text: ''});

```

---

##### New in 0.12.0:
##### Now you can replace the whole state just by returning a new value. It works in both `transform` and `transformAt`.

This allows you for deciding when you want to transform only some properties and when you just want to replace a whole state:

```javascript
function dec(d) {
    if (d.counter > 0)
        d.counter--; // mutation-like mode
    else
        return {message: 'countdown finished'}  // "returnish" mode
}

for (var i = 0, state = {counter:3}; i < 4; i++) {
    state = transform(dec, state);
    console.log(state)
}
// logs:
// { counter: 2 }
// { counter: 1 }
// { counter: 0 }
// { message: 'countdown finished' }

```

You can also use it feature for transforming selected properties when using `transformAt`:

```javascript
transformAt(['foo', 'bar'], bar => bar + 1, {
    foo: {
        bar: 10
    }
}); // returns: { foo: { bar: 11 } }
```


---

## Performance

Check out [benchmark code](benchmark.js).


Times in ms (the lower the better).

changing 100 objects in array of 1000 items. Repeated 10000 times.


ES6 Proxies

* Time for **transmutable** (ES6 - Proxy):  **2036ms**
* Time for immer (ES6 - proxies, without autofreeze):  2619ms

ES5 fallback

* Time for **transmutable** (ES5 - diffing):  **830ms**
* Time for immer (ES5 - getters/setters, without autofreeze):  12881ms

updating arbitrary object, one nested update. Repeated 10000 times


ES6 Proxies

* Time for **transmutable** (ES6 - proxies):  **52ms**
* Time for immer - (ES6 - proxies, without autofreeze):  94ms

ES5 fallback

* Time for transmutable (ES5 - diffing) - example:  473ms
* Time for **immer** - (ES5 - getters/setters, without autofreeze):  **249ms**

Tested on:

Node v8.4.0

Transmutable: 0.15.4

Immer: 1.0.1

## Comparison with other libraries

Differences with Immer.

* ES6 Proxy implementation of Transmutable is faster than ES6 Proxy implementation of Immer
* comparison of ES5 implementations seems to be inconclusive (look above into detailed results of the benchmark)
* Transmutable has additional function `transformAt` for transforming only a slice of state
* Transmutable support "returnish" style of transformer, Immer does not and displays a warning when you try to do this.
* `transform`/`produce` functions. Both libraries support parameter order: function, object. Both libraries support currying. But `immer` also supports object, function order.
* Immer supports frozen objects (it can be disabled). Transmutable does not support frozen objects.


## Gotchas


###### General:

* Transmutable assumes immutability, so you should not perform any mutation of your objects outside the `transmutable` API.

###### Things dependent on current implementation:

* In current version of Transmutable your state should be plain JS objects (numbers, strings, booleans, arrays, nested objects). You should not **currently** use e.g. ES6 Maps in your state. This may change in future versions.

* Transmutable assumes by default that your state is a tree (one root object containing hierarchy of child objects), so no circular references, no repeated references etc.

* Transmutable currently does not support frozen objects. Even if you freeze them by yourself (file an issue if this is a matter for you).

