import createTester from '../../helpers/tester.js';



const {test} = createTester(import.meta.resolve('.'));



test({
	valid: [
		{
			name: 'does not require empty lines before the first statement or after the last statement',
			code: `
				const foo = 1;
			`,
		},
		{
			name: 'does not require empty lines between ordinary top-level statements',
			code: `
				const foo = 1;
				const bar = 2;
			`,
		},
		{
			name: 'accepts empty lines between ordinary top-level statements',
			code: `
				const foo = 1;

				const bar = 2;



				const baz = 2;
			`,
		},
	],
});
