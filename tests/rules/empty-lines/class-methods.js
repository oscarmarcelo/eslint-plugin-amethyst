import createTester from '../../helpers/tester.js';



const {testValidAndInvalid} = createTester(import.meta.resolve('.'));



const testCases = [
	{
		name: 'two empty lines between methods',
		code: `
			class Outer {
				foo() {}
				bar() {}
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
			class Outer {
				foo() {}


				bar() {}
			}
		`,
	},
];

testValidAndInvalid('accepts', 'requires', testCases);
