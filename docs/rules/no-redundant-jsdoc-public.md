# amethyst/no-redundant-jsdoc-public

📝 Disallow redundant `@public` JSDoc annotations.

💼 This rule is enabled in the following configs: 🌐 `all`, 🛠️ `compatibility`, 🟣 `core`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->



## Rule Details

Disallow `@public` annotations in JSDoc comments unless they are accompanied by an `@override` or `@inheritdoc` annotation, allowing visibility to be inherited from the parent or overridden member.



## Examples

```js
// ❌
/**
 * @public
 */
function foo() {}
```

```js
// ❌
/**
 * @public
 *
 * @param {string} value - The value.
 */
function foo(value) {}

// ✅
/**
 * @param {string} value - The value.
 */
function foo(value) {}
```

Using `@public` is allowed when accompanied with `@override` or `@inheritdoc`.

```js
// ✅
/**
 * @public
 *
 * @override
 */
class Foo extends Bar {}
```

```js
// ✅
/**
 * @public
 *
 * @inheritdoc
 */
function foo() {}
```

The rule also applies to inline JSDoc comments:

```js
// ❌
/** @public */ function foo() {}

// ✅
/** */ function foo() {}
```
