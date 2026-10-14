import createTester from '../../helpers/tester.js';



const {test, testValidAndInvalid} = createTester(import.meta.resolve('.'));



test({
	valid: [
		{
			name: 'does not require empty lines before or after a standalone JSDoc comment',
			code: `
				/**
				 * A JSDoc comment.
				 */
			`,
		},
		{
			name: 'accepts JSDoc comments attached to a statement',
			code: `
				/**
				 * A JSDoc comment.
				 */
				const foo = 1;
			`,
		},
	],
});


const testCases = [
	{
		name: 'three empty lines before and after a standalone JSDoc comment',
		code: `
			const foo = 1;

			/**
			 * A JSDoc comment.
			 */

			const bar = 2;
		`,
		errors: [
			{
				messageId: 'require-empty-lines-before',
			},
			{
				messageId: 'require-empty-lines-after',
			},
		],
		output: `
			const foo = 1;



			/**
			 * A JSDoc comment.
			 */



			const bar = 2;
		`,
	},
	{
		name: 'three empty lines between consecutive standalone JSDoc comments',
		code: `
			/**
			 * A JSDoc comment.
			 */
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
		],
		output: `
			/**
			 * A JSDoc comment.
			 */



			/**
			 * Another JSDoc comment.
			 */
		`,
	},
	{
		name: 'three empty lines between a standalone JSDoc comment and an attached JSDoc comment',
		code: `
			/**
			 * A JSDoc comment.
			 */
			/**
			 * Another JSDoc comment.
			 */
			const foo = 1;
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
			const foo = 1;
		`,
	},
	{
		name: 'three empty lines before a standalone JSDoc comment',
		code: `
			const foo = 1;
			/**
			 * A JSDoc comment.
			 */
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
		`,
	},
	{
		name: 'three empty lines between a statement and an attached JSDoc comment',
		code: `
			const foo = 1;
			/**
			 * A JSDoc comment.
			 */
			const bar = 2;
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
			const bar = 2;
		`,
	},
];

testValidAndInvalid('accepts', 'requires', testCases);
