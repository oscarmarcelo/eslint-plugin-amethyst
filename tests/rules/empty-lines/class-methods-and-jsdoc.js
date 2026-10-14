import createTester from '../../helpers/tester.js';



const {testValidAndInvalid} = createTester(import.meta.resolve('.'));



const testCases = [
	{
		name: 'two empty lines between methods with a JSDoc comment attached',
		code: `
			class Foo {
				/**
				 * A JSDoc comment.
				 */
				bar() {}
				/**
				 * Another JSDoc comment.
				 */
				baz() {}
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
			class Foo {
				/**
				 * A JSDoc comment.
				 */
				bar() {}


				/**
				 * Another JSDoc comment.
				 */
				baz() {}
			}
		`,
	},
	{
		name: 'two empty lines between standalone JSDoc comments and methods with a JSDoc comment attached',
		code: `
			class Foo {
				/**
				 * A JSDoc comment.
				 */
				/**
				 * Another JSDoc comment.
				 */
				baz() {}
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
			class Foo {
				/**
				 * A JSDoc comment.
				 */


				/**
				 * Another JSDoc comment.
				 */
				baz() {}
			}
		`,
	},
	{
		name: 'two empty lines between methods and standalone JSDoc comments',
		code: `
			class Foo {
				/**
				 * A JSDoc comment.
				 */

				bar() {}

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
			class Foo {
				/**
				 * A JSDoc comment.
				 */


				bar() {}


				/**
				 * Another JSDoc comment.
				 */
			}
		`,
	},
];

testValidAndInvalid('accepts', 'requires', testCases);
