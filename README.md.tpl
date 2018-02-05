### Transmutable - immutable objects that pretend to be mutable

![logo: on left there is a red circle
 (representing original state). On right there are two circles: red (because original state is the same before and after), and a blue one (new state derived from first one)](https://raw.githubusercontent.com/hex13/transmutable/master/logo.svg?sanitize=true)


Transmutable is a small library ({{ size }}kB) which allows to write immutable code in a way which is very similar to writing mutable code.

Instead of `...` / `Object.assign` you just call `transform` with your transforming function as an argument. Your function will get `draft`, i.e. special Proxy object (or just a copy of state, if ES6 Proxies aren't available). Then you can "mutate" your draft object.

Example:
```javascript

const o1 = {
    some: {
        object: {
            animal: 'cat'
        }
    },
    notTouched: {
        abc: 123
    }
};

const o2 = transform((d) => {
    d.some.object.animal = 'dog';
}, o1);

```

After that Transmutable will go through your mutations and will make automatically a new object derived from previous object + mutations you have provided. Things your modify will be copied with changes applied to the copy, things you didn't touch will be copied just by reference (structural sharing) so you don't lose your immutable references.

![screenshot](https://raw.githubusercontent.com/hex13/transmutable/master/screenshot-transmutable.png)

It allows for reducing of boilerplate traditionally associated with writing immutable code in JavaScript (especially in libraries like Redux).


Consider more mainstream approach...

```javascript
copy = {
  ...foo,
    bar: {
      ...foo.bar,
      baz: 123
    }
}
```

or even this (even more verbose with `Object.assign`):

```javascript
copy = Object.assign(
  {},
  foo,
  {
    bar: Object.assign(
      {},
      foo.bar,
      {baz: 123}
    )
  }
)
```

This is just wrong. Not very readable or maintainable.

And heres comes Transmutable for the rescue.

Transmutable is based on idea that immutability should not come at the cost of developer experience.

So instead of forcing user to manually copying objects with `Object.assign` / `...`, it leaves this part to the library. The library presents you a `draft` (proxy object which records your mutations and creates some kind of patch).

Then patch is applied and you have effect similar to nested `...` / `Object.assign` madness but handled automatically for you.

### Usage

`transform` function:

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

With Redux:

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

### Performance

Check out [benchmark code](https://github.com/hex13/enter-ghost/blob/master/packages/transmutable/benchmark.js).


Times in ms (the lower the better).

Pushing 1000 objects to array. Repeated 10000 times.

1. Time for **transmutable** (transform function) - array: 1770ms
2. Time for immer without autofreeze - array:  2733ms

change one deep property in state. Repeated 10000 times.

1. Time for hand crafted reducer - example:  48ms
2. Time for **transmutable** (transform function)- example:  50ms
3. Time for immer without autofreeze - example:  98ms

Tested on:

Node v8.4.0

Transmutable: 0.11.0

Immer: 0.8.1

### Comparison

Differences with Immer.

* Transmutable is faster (look above)
* Transmutable has additional function `transformAt` for transforming only a slice of state
* Transmutable support "returnish" style of transformer, Immer does not and displays a warning when you try to do this.
* `transform`/`produce` functions. Both libraries support parameter order: function, object. Both libraries support currying. But `immer` also supports object, function order.
* Immer supports frozen objects (it can be disabled). Transmutable does not support frozen objects.


### Gotchas


###### General:

* Transmutable assumes immutability, so you should not perform any mutation of your objects outside the `transmutable` API.

###### Things dependent on current implementation:

* In current version of Transmutable your state should be plain JS objects (numbers, strings, booleans, arrays, nested objects). You should not **currently** use e.g. ES6 Maps in your state. This may change in future versions.

* Transmutable assumes by default that your state is a tree (one root object containing hierarchy of child objects), so no circular references, no repeated references etc.

* Transmutable currently does not support frozen objects. Even if you freeze them by yourself (file an issue if this is a matter for you).
