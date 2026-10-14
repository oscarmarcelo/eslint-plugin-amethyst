import createTester from '../../helpers/tester.js';



const {testValidAndInvalid} = createTester(import.meta.resolve('.'));

const declarations = {
	function: {
		foo: 'function foo() {}',
		bar: 'function bar() {}',
		nonType: 'class Baz {}',
	},
	class: {
		foo: 'class Foo {}',
		bar: 'class Bar {}',
		nonType: 'function baz() {}',
	},
};



for (const [name, values] of Object.entries(declarations)) {
	const testCases = [
		{
			name: `two empty lines between nested ${name} declarations with a JSDoc comment attached`,
			code: `
				function outer() {
					/**
					 * A JSDoc comment.
					 */
					${values.foo}
					/**
					 * Another JSDoc comment.
					 */
					${values.bar}
				}
			`,
			errors: [
				{
					messageId: 'require-empty-lines-after',
				},
				{
					messageId: 'require-empty-lines-before',
				},
			],
			output: `
				function outer() {
					/**
					 * A JSDoc comment.
					 */
					${values.foo}


					/**
					 * Another JSDoc comment.
					 */
					${values.bar}
				}
			`,
		},
		{
			name: `two empty lines between standalone JSDoc comments and nested ${name} declarations with a JSDoc comment attached`,
			code: `
				function outer() {
					/**
					 * A JSDoc comment.
					 */
					/**
					 * Another JSDoc comment.
					 */
					${values.foo}
				}
			`,
			errors: [
				{
					messageId: 'require-empty-lines-after',
				},
				{
					messageId: 'require-empty-lines-before',
				},
			],
			output: `
				function outer() {
					/**
					 * A JSDoc comment.
					 */


					/**
					 * Another JSDoc comment.
					 */
					${values.foo}
				}
			`,
		},
		{
			name: `two empty lines between nested ${name} declarations and standalone JSDoc comments`,
			code: `
				function outer() {
					/**
					 * A JSDoc comment.
					 */

					${values.foo}

					/**
					 * Another JSDoc comment.
					 */
				}
			`,
			errors: [
				{
					messageId: 'require-empty-lines-after',
				},
				{
					messageId: 'require-empty-lines-before',
				},
				{
					messageId: 'require-empty-lines-after',
				},
				{
					messageId: 'require-empty-lines-before',
				},
			],
			output: `
				function outer() {
					/**
					 * A JSDoc comment.
					 */


					${values.foo}


					/**
					 * Another JSDoc comment.
					 */
				}
			`,
		},
	];

	testValidAndInvalid('accepts', 'requires', testCases);
}
