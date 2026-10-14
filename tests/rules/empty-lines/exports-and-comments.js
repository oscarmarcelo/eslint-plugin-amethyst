import createTester from '../../helpers/tester.js';



const {testValidAndInvalid} = createTester(import.meta.resolve('.'));



const testCases = [
	{
		name: 'three empty lines before export declarations with a line comment attached',
		code: `
			const foo = 1;
			// A comment.
			export {foo};
		`,
		errors: [
			{
				messageId: 'require-empty-lines-before',
			},
		],
		output: `
			const foo = 1;



			// A comment.
			export {foo};
		`,
	},
	{
		name: 'three empty lines before export declarations with a multiline line comment attached',
		code: `
			const foo = 1;
			// A
			// comment.
			export {foo};
		`,
		errors: [
			{
				messageId: 'require-empty-lines-before',
			},
		],
		output: `
			const foo = 1;



			// A
			// comment.
			export {foo};
		`,
	},
	{
		name: 'three empty lines between nested export declarations and standalone line comments',
		code: `
			// A comment.

			export const foo = 1;

			// Another comment.
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
			// A comment.



			export const foo = 1;



			// Another comment.
		`,
	},
	{
		name: 'three empty lines before export declarations with a block comment attached',
		code: `
			const foo = 1;
			/*
			A comment.
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



			/*
			A comment.
			*/
			export {foo};
		`,
	},
	{
		name: 'three empty lines between nested export declarations and standalone block comments',
		code: `
			/*
			A comment.
			*/

			export const foo = 1;

			/*
			Another comment.
			*/
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
			/*
			A comment.
			*/



			export const foo = 1;



			/*
			Another comment.
			*/
		`,
	},
];

testValidAndInvalid('accepts', 'requires', testCases);
