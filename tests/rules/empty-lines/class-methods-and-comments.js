import createTester from '../../helpers/tester.js';



const {testValidAndInvalid} = createTester(import.meta.resolve('.'));



const testCases = [
	{
		name: 'two empty lines between methods with a line comment attached',
		code: `
			class Foo {
				// A comment.
				bar() {}
				// Another comment.
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
				// A comment.
				bar() {}


				// Another comment.
				baz() {}
			}
		`,
	},
	{
		name: 'two empty lines between methods with a multiline line comment attached',
		code: `
			class Foo {
				// A
				// comment.
				bar() {}
				// Another
				// comment.
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
				// A
				// comment.
				bar() {}


				// Another
				// comment.
				baz() {}
			}
		`,
	},
	{
		name: 'two empty lines between methods and standalone line comments',
		code: `
			class Foo {
				// A comment.

				bar() {}

				// Another comment.
			}
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
			class Foo {
				// A comment.


				bar() {}


				// Another comment.
			}
		`,
	},
	{
		name: 'two empty lines between methods with a block comment attached',
		code: `
			class Foo {
				/*
				A comment.
				*/
				bar() {}
				/*
				Another comment.
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
				/*
				A comment.
				*/
				bar() {}


				/*
				Another comment.
				*/
				baz() {}
			}
		`,
	},
	{
		name: 'two empty lines between methods and standalone block comments',
		code: `
			class Foo {
				/*
				A comment.
				*/

				bar() {}

				/*
				Another comment.
				*/
			}
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
			class Foo {
				/*
				A comment.
				*/


				bar() {}


				/*
				Another comment.
				*/
			}
		`,
	},
];

testValidAndInvalid('accepts', 'requires', testCases);
