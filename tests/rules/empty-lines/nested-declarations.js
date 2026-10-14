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
	test({
		valid: [
			{
				name: `does not apply top-level empty lines to nested ${name} declarations`,
				code: `
					function outer() {
						${values.foo}
					}
				`,
			},
		],
	});


	const testCases = [
		{
			name: `two empty lines between consecutive nested ${name} declarations`,
			code: `
				function outer() {
					${values.foo}
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
					${values.foo}


					${values.bar}
				}
			`,
		},
		{
			name: `two empty lines between a nested ${name} declaration and another declaration type`,
			code: `
				function outer() {
					${values.foo}
					${values.nonType}
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
					${values.foo}


					${values.nonType}
				}
			`,
		},
		{
			name: `two empty lines before and after nested ${name} declarations and other statements`,
			code: `
				function outer() {
					const before = 1;
					${values.foo}
					const after = 2;
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
				function outer() {
					const before = 1;


					${values.foo}


					const after = 2;
				}
			`,
		},
	];

	testValidAndInvalid('accepts', 'requires', testCases);


	test({
		invalid: [
			{
				name: `reports nested inline ${name} declarations`,
				code: `
					function outer() {
						const before = 1; ${values.foo} const after = 2;
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
					function outer() {
						const before = 1;


						${values.foo}


						const after = 2;
					}
				`,
			},
			{
				name: `reports consecutive nested inline ${name} declarations`,
				code: `
					function outer() {
						${values.foo} ${values.bar}
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
						${values.foo}


						${values.bar}
					}
				`,
			},
			{
				name: `reports a nested inline ${name} declaration and another inline declaration type`,
				code: `
					function outer() {
						${values.foo} ${values.nonType}
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
						${values.foo}


						${values.nonType}
					}
				`,
			},
		],
	});
}
