import createTester from '../../helpers/tester.js';



const {testValidAndInvalid} = createTester(import.meta.resolve('.'));

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
			name: `three empty lines between top-level ${name} declarations with a line comment attached`,
			code: `
				${values.foo}
				// A comment.
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



				// A comment.
				${values.bar}
			`,
		},
		{
			name: `three empty lines between top-level ${name} declarations with a multiline line comment attached`,
			code: `
				${values.foo}
				// A
				// comment.
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



				// A
				// comment.
				${values.bar}
			`,
		},
		{
			name: `three empty lines between top-level ${name} declarations and standalone line comments`,
			code: `
				// A comment.

				${values.foo}

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



				${values.foo}



				// Another comment.
			`,
		},
		{
			name: `three empty lines between top-level ${name} declarations with a block comment attached`,
			code: `
				${values.foo}
				/*
				A comment.
				*/
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



				/*
				A comment.
				*/
				${values.bar}
			`,
		},
		{
			name: `three empty lines between top-level ${name} declarations and standalone block comments`,
			code: `
				/*
				A comment.
				*/

				${values.foo}

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



				${values.foo}



				/*
				Another comment.
				*/
			`,
		},
	];

	testValidAndInvalid('accepts', 'requires', testCases);
}
