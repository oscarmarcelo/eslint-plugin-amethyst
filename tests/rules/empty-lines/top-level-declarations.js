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
			name: `three empty lines between consecutive top-level ${name} declarations`,
			code: `
				${values.foo}
				${values.bar}
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
				${values.foo}



				${values.bar}
			`,
		},
		{
			name: `three empty lines between a top-level ${name} declaration and another declaration type`,
			code: `
				${values.foo}
				${values.nonType}
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
				${values.foo}



				${values.nonType}
			`,
		},
		{
			name: `three empty lines before and after top-level ${name} declarations and other statements`,
			code: `
				const before = 1;
				${values.foo}
				const after = 2;
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
				const before = 1;



				${values.foo}



				const after = 2;
			`,
		},
		{
			name: `three empty lines between top-level ${name} declarations and standalone comments`,
			code: `
				// A comment.

				${values.foo}

				// A comment.
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



				${values.foo}



				// A comment.
			`,
		},
	];

	testValidAndInvalid('accepts', 'requires', testCases);


	test({
		invalid: [
			{
				name: `reports inline top-level ${name} declarations`,
				code: `
					const before = 1; ${values.foo} const after = 2;
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
					const before = 1;



					${values.foo}



					const after = 2;
				`,
			},
			{
				name: `reports consecutive inline top-level ${name} declarations`,
				code: `
					${values.foo} ${values.bar}
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
					${values.foo}



					${values.bar}
				`,
			},
			{
				name: `reports an inline top-level ${name} declaration and another inline declaration type`,
				code: `
					${values.foo} ${values.nonType}
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
					${values.foo}



					${values.nonType}
				`,
			},
		],
	});
}
