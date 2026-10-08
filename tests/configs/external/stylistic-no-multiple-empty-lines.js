import createTester from '../../helpers/config-tester.js';



const test = createTester('external', '@stylistic/no-multiple-empty-lines');



test({
	valid: [
		{
			name: 'allows 2 lines',
			code: `
				const foo = 1;


				const bar = 2;
			`,
		},
		{
			name: 'allows 3 lines',
			code: `
				const foo = 1;



				const bar = 2;
			`,
		},
	],
	invalid: [
		{
			name: 'requires at most 3 lines',
			code: `
				const foo = 1;




				const bar = 2;
			`,
			errors: [
				{messageId: 'consecutiveBlank'},
			],
		},
	],
});


test({
	valid: [
		{
			name: 'doesn\'t affect to non-JavaScript files',
			filename: 'test.txt',
			code: `
				const foo = 1;




				const bar = 2;
			`,
		},
	],
});
