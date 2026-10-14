import createTester from '../../helpers/tester.js';



const {test, testValidAndInvalid} = createTester(import.meta.resolve('.'));



const testCases = [
	{
		name: 'trailing line comments before a class declaration',
		code: `
			function outer() {
				class Foo {} // A trailing comment
				class Bar {}
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
				class Foo {} // A trailing comment


				class Bar {}
			}
		`,
	},
	{
		name: 'trailing block comments before a class declaration',
		code: `
			function outer() {
				class Foo {} /* A trailing comment */
				class Bar {}
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
				class Foo {} /* A trailing comment */


				class Bar {}
			}
		`,
	},
	{
		name: 'multiline trailing block comments before a class declaration',
		code: `
			function outer() {
				class Foo {} /*
				A trailing comment
				*/
				class Bar {}
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
				class Foo {} /*
				A trailing comment
				*/


				class Bar {}
			}
		`,
	},
	{
		name: 'multiple trailing block comments before a class declaration',
		code: `
			function outer() {
				class Foo {} /* A trailing comment */ /* Another trailing comment */
				class Bar {}
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
				class Foo {} /* A trailing comment */ /* Another trailing comment */


				class Bar {}
			}
		`,
	},
	{
		name: 'multiple trailing mixed comments before a class declaration',
		code: `
			function outer() {
				class Foo {} /* A trailing comment */ // Another trailing comment
				class Bar {}
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
				class Foo {} /* A trailing comment */ // Another trailing comment


				class Bar {}
			}
		`,
	},
	{
		name: 'multiple multiline trailing block comments before a class declaration',
		code: `
			function outer() {
				class Foo {} /*
				A trailing comment
				*/ /*
				Another trailing comment
				*/
				class Bar {}
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
				class Foo {} /*
				A trailing comment
				*/ /*
				Another trailing comment
				*/


				class Bar {}
			}
		`,
	},
	{
		name: 'multiple multiline trailing mixed comments before a class declaration',
		code: `
			function outer() {
				class Foo {} /*
				A trailing comment
				*/ // Another trailing comment
				class Bar {}
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
				class Foo {} /*
				A trailing comment
				*/ // Another trailing comment


				class Bar {}
			}
		`,
	},
];

testValidAndInvalid('accepts', 'preserves', testCases);


test({
	invalid: [
		{
			name: 'preserves trailing block comments before an inline class declaration',
			code: `
				function outer() {
					class Foo {} /* A trailing comment */ class Bar {}
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
					class Foo {} /* A trailing comment */


					class Bar {}
				}
			`,
		},
		{
			name: 'preserves trailing multiline block comments before an inline class declaration',
			code: `
				function outer() {
					class Foo {} /*
					A trailing comment
					*/ class Bar {}
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
					class Foo {} /*
					A trailing comment
					*/


					class Bar {}
				}
			`,
		},
		{
			name: 'preserves multiple trailing block comments before an inline class declaration',
			code: `
				function outer() {
					class Foo {} /* A trailing comment */ /* Another trailing comment */ class Bar {}
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
					class Foo {} /* A trailing comment */ /* Another trailing comment */


					class Bar {}
				}
			`,
		},
		{
			name: 'preserves multiple trailing multiline block comments before an inline class declaration',
			code: `
				function outer() {
					class Foo {} /*
					A trailing comment
					*/ /*
					Another trailing comment
					*/ class Bar {}
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
					class Foo {} /*
					A trailing comment
					*/ /*
					Another trailing comment
					*/


					class Bar {}
				}
			`,
		},
	],
});
