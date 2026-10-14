import createTester from '../../helpers/tester.js';



const {test, testValidAndInvalid} = createTester(import.meta.resolve('.'));

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
			name: `trailing line comments before a ${name} declaration`,
			code: `
				function outer() {
					${values.foo} // A trailing comment
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
					${values.foo} // A trailing comment


					${values.bar}
				}
			`,
		},
		{
			name: `trailing block comments before a ${name} declaration`,
			code: `
				function outer() {
					${values.foo} /* A trailing comment */
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
					${values.foo} /* A trailing comment */


					${values.bar}
				}
			`,
		},
		{
			name: `multiline trailing block comments before a ${name} declaration`,
			code: `
				function outer() {
					${values.foo} /*
					A trailing comment
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
					${values.foo} /*
					A trailing comment
					*/


					${values.bar}
				}
			`,
		},
		{
			name: `multiple trailing block comments before a ${name} declaration`,
			code: `
				function outer() {
					${values.foo} /* A trailing comment */ /* Another trailing comment */
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
					${values.foo} /* A trailing comment */ /* Another trailing comment */


					${values.bar}
				}
			`,
		},
		{
			name: `multiple trailing mixed comments before a ${name} declaration`,
			code: `
				function outer() {
					${values.foo} /* A trailing comment */ // Another trailing comment
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
					${values.foo} /* A trailing comment */ // Another trailing comment


					${values.bar}
				}
			`,
		},
		{
			name: `multiple multiline trailing block comments before a ${name} declaration`,
			code: `
				function outer() {
					${values.foo} /*
					A trailing comment
					*/ /*
					Another trailing comment
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
					${values.foo} /*
					A trailing comment
					*/ /*
					Another trailing comment
					*/


					${values.bar}
				}
			`,
		},
		{
			name: `multiple multiline trailing mixed comments before a ${name} declaration`,
			code: `
				function outer() {
					${values.foo} /*
					A trailing comment
					*/ // Another trailing comment
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
					${values.foo} /*
					A trailing comment
					*/ // Another trailing comment


					${values.bar}
				}
			`,
		},
	];

	testValidAndInvalid('accepts', 'preserves', testCases);


	test({
		invalid: [
			{
				name: `preserves trailing block comments before an inline ${name} declaration`,
				code: `
					function outer() {
						${values.foo} /* A trailing comment */ ${values.bar}
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
						${values.foo} /* A trailing comment */


						${values.bar}
					}
				`,
			},
			{
				name: `preserves trailing multiline block comments before an inline ${name} declaration`,
				code: `
					function outer() {
						${values.foo} /*
						A trailing comment
						*/ ${values.bar}
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
						${values.foo} /*
						A trailing comment
						*/


						${values.bar}
					}
				`,
			},
			{
				name: `preserves multiple trailing block comments before an inline ${name} declaration`,
				code: `
					function outer() {
						${values.foo} /* A trailing comment */ /* Another trailing comment */ ${values.bar}
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
						${values.foo} /* A trailing comment */ /* Another trailing comment */


						${values.bar}
					}
				`,
			},
			{
				name: `preserves multiple trailing multiline block comments before an inline ${name} declaration`,
				code: `
					function outer() {
						${values.foo} /*
						A trailing comment
						*/ /*
						Another trailing comment
						*/ ${values.bar}
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
						${values.foo} /*
						A trailing comment
						*/ /*
						Another trailing comment
						*/


						${values.bar}
					}
				`,
			},
		],
	});
}
