import createTester from '../../helpers/tester.js';



const {testValidAndInvalid} = createTester(import.meta.resolve('.'));



const declarations = {
	function: {
		bar: 'function bar() {}',
		baz: 'function baz() {}',
		nonType: 'class Baz {}',
	},
	class: {
		bar: 'class Bar {}',
		baz: 'class Baz {}',
		nonType: 'function baz() {}',
	},
};

for (const [name, values] of Object.entries(declarations)) {
	const testCases = [
		{
			name: `three empty lines before and after an exported ${name} declaration`,
			code: `
				const foo = 1;
				export ${values.bar}
				const baz = 2;
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



				export ${values.bar}



				const baz = 2;
			`,
		},
		{
			name: `three empty lines between an exported ${name} declaration and other export declarations`,
			code: `
				export const foo = 1;
				export ${values.bar}
				export const baz = 2;
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
				export const foo = 1;



				export ${values.bar}



				export const baz = 2;
			`,
		},
		{
			name: `three empty lines between consecutive exported ${name} declarations`,
			code: `
				export ${values.bar}
				export ${values.baz}
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
				export ${values.bar}



				export ${values.baz}
			`,
		},
		{
			name: `three empty lines between an exported ${name} declarations and another exported declaration type`,
			code: `
				export ${values.bar}
				export ${values.nonType}
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
				export ${values.bar}



				export ${values.nonType}
			`,
		},
	];

	testValidAndInvalid('accepts', 'requires', testCases);
}
