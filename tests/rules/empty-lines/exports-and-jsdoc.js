import createTester from '../../helpers/tester.js';



const {testValidAndInvalid} = createTester(import.meta.resolve('.'));



const testCases = [
	{
		name: 'three empty lines before export declarations with a JSDoc comment attached',
		code: `
			const foo = 1;
			/**
			 * A JSDoc comment.
			 */
			export {foo};
		`,
		errors: [
			{
				messageId: 'require-empty-lines-before',
			},
		],
		output: `
			const foo = 1;



			/**
			 * A JSDoc comment.
			 */
			export {foo};
		`,
	},
	{
		name: 'three empty lines between standalone JSDoc comments and export declarations with a JSDoc comment attached',
		code: `
			/**
			 * A JSDoc comment.
			 */
			/**
			 * Another JSDoc comment.
			 */
			export const foo = 1;
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
			/**
			 * A JSDoc comment.
			 */



			/**
			 * Another JSDoc comment.
			 */
			export const foo = 1;
		`,
	},
	{
		name: 'three empty lines between nested export declarations and standalone JSDoc comments',
		code: `
			/**
			 * A JSDoc comment.
			 */

			export const foo = 1;

			/**
			 * Another JSDoc comment.
			 */
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
			/**
			 * A JSDoc comment.
			 */



			export const foo = 1;



			/**
			 * Another JSDoc comment.
			 */
		`,
	},
	{
		name: 'three empty lines between exports with attached JSDoc comments',
		code: `
			/**
			 * A JSDoc comment.
			 */
			export const foo = 1;
			/**
			 * Another JSDoc comment.
			 */
			export const bar = 2;
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
			/**
			 * A JSDoc comment.
			 */
			export const foo = 1;



			/**
			 * Another JSDoc comment.
			 */
			export const bar = 2;
		`,
	},
];

testValidAndInvalid('accepts', 'requires', testCases);
