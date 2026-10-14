# amethyst/empty-lines

📝 Enforce consistent empty lines between two statements.

💼 This rule is enabled in the following configs: 🌐 `all`, 🛠️ `compatibility`, 🟣 `core`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->



## Rule Details

Enforce consistent empty lines between two statements, including declarations, imports, exports, and comments.


### Imports

Import declarations can be grouped together without empty lines between them. The last import declaration requires three empty lines after it when other code follows.

```js
// ❌
import foo from 'foo';
import bar from 'bar';
const baz = 1;

// ✅
import foo from 'foo';
import bar from 'bar';



const baz = 1;
```

JSDoc import comments, such as comments containing `@import` or `@typedef {import(...` tags, require only one empty line between the comment and an adjacent import declaration.

```js
// ❌
import foo from 'foo';
/**
 * @import bar from 'bar';
 */

// ✅
import foo from 'foo';

/**
 * @import bar from 'bar';
 */
```


### Top-level declarations

Function and class declarations require three empty lines before and after them. This applies regardless of the type of the adjacent declaration.

```js
// ❌
function foo() {}
class Bar {}

// ✅
function foo() {}



class Bar {}
```


### Nested declarations and methods

Function and class declarations inside function bodies, as well as class methods, require two empty lines before and after them.

```js
// ❌
function foo() {
	function bar() {}
	function baz() {}
}

// ✅
function foo() {
	function bar() {}


	function baz() {}
}
```

```js
// ❌
class Foo {
	bar() {}
	baz() {}
}

// ✅
class Foo {
	bar() {}


	baz() {}
}
```


### Export declarations

Export declarations require three empty lines on either side when the adjacent code unit is not another export declaration. Consecutive exports can remain together without empty lines.

```js
// ❌
const foo = 1;
export {foo};
export const bar = 2;
const baz = 3;

// ✅
const foo = 1;



export {foo};
export const bar = 2;



const baz = 3;
```

However, exported function and class declarations always require three empty lines before and after them, even when adjacent to other export declarations.

```js
// ❌
export const foo = 1;
export function bar() {}
export const baz = 2;

// ✅
export const foo = 1;



export function bar() {}



export const baz = 2;
```


### JSDoc comments

Standalone JSDoc comments (not attached to any code) require three empty lines before and after them.

```js
// ❌
const foo = 1;

/**
 * @typedef {object} Options
 */

const bar = 2;

// ✅
const foo = 1;



/**
 * @typedef {object} Options
 */



const bar = 2;
```
