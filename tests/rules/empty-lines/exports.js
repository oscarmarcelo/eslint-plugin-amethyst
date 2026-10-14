import createTester from '../../helpers/tester.js';



const {test, testValidAndInvalid} = createTester(import.meta.resolve('.'));



test({
	valid: [
		{
			name: 'does not require empty lines between exports',
			code: `
				export const foo = 1;
				export const bar = 2;
			`,
		},
		{
			name: 'accepts empty lines between exports',
			code: `
				export const foo = 1;

				export const bar = 2;



				export const baz = 2;
			`,
		},
	],
});


const testCases = [
	{
		name: 'three empty lines between an export and non-export statement',
		code: `
			const foo = 1;
			export {foo};
			export {foo as bar};
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



			export {foo};
			export {foo as bar};



			const baz = 2;
		`,
	},
];

testValidAndInvalid('accepts', 'requires', testCases);
