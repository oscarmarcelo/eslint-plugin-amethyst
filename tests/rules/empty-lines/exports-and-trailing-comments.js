import createTester from '../../helpers/tester.js';



const {test, testValidAndInvalid} = createTester(import.meta.resolve('.'));



const testCases = [
	{
		name: 'trailing line comments before a export declaration',
		code: `
			export function foo() {} // A trailing comment
			export function bar() {}
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
			export function foo() {} // A trailing comment



			export function bar() {}
		`,
	},
	{
		name: 'trailing block comments before a export declaration',
		code: `
			export function foo() {} /* A trailing comment */
			export function bar() {}
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
			export function foo() {} /* A trailing comment */



			export function bar() {}
		`,
	},
	{
		name: 'multiline trailing block comments before a export declaration',
		code: `
			export function foo() {} /*
			 A trailing comment
			 */
			export function bar() {}
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
			export function foo() {} /*
			 A trailing comment
			 */



			export function bar() {}
		`,
	},
	{
		name: 'multiple trailing block comments before a export declaration',
		code: `
			export function foo() {} /* A trailing comment */ /* Another trailing comment */
			export function bar() {}
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
			export function foo() {} /* A trailing comment */ /* Another trailing comment */



			export function bar() {}
		`,
	},
	{
		name: 'multiple trailing mixed comments before a export declaration',
		code: `
			export function foo() {} /* A trailing comment */ // Another trailing comment
			export function bar() {}
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
			export function foo() {} /* A trailing comment */ // Another trailing comment



			export function bar() {}
		`,
	},
	{
		name: 'multiple multiline trailing block comments before a export declaration',
		code: `
			export function foo() {} /*
			 A trailing comment
			 */ /*
			 Another trailing comment
			 */
			export function bar() {}
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
			export function foo() {} /*
			 A trailing comment
			 */ /*
			 Another trailing comment
			 */



			export function bar() {}
		`,
	},
	{
		name: 'multiple multiline trailing mixed comments before a export declaration',
		code: `
			export function foo() {} /*
			 A trailing comment
			 */ // Another trailing comment
			export function bar() {}
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
			export function foo() {} /*
			 A trailing comment
			 */ // Another trailing comment



			export function bar() {}
		`,
	},
];

testValidAndInvalid('accepts', 'preserves', testCases);


test({
	invalid: [
		{
			name: 'preserves trailing block comments before an inline export declaration',
			code: `
				export function foo() {} /* A trailing comment */ export function bar() {}
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
				export function foo() {} /* A trailing comment */



				export function bar() {}
			`,
		},
		{
			name: 'preserves trailing multiline block comments before an inline export declaration',
			code: `
				export function foo() {} /*
				A trailing comment
				*/ export function bar() {}
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
				export function foo() {} /*
				A trailing comment
				*/



				export function bar() {}
			`,
		},
		{
			name: 'preserves multiple trailing block comments before an inline export declaration',
			code: `
				export function foo() {} /* A trailing comment */ /* Another trailing comment */ export function bar() {}
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
				export function foo() {} /* A trailing comment */ /* Another trailing comment */



				export function bar() {}
			`,
		},
		{
			name: 'preserves multiple trailing multiline block comments before an inline export declaration',
			code: `
				export function foo() {} /*
				A trailing comment
				*/ /*
				Another trailing comment
				*/ export function bar() {}
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
				export function foo() {} /*
				A trailing comment
				*/ /*
				Another trailing comment
				*/



				export function bar() {}
			`,
		},
	],
});
