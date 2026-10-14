import createTester from '../../helpers/tester.js';



const {test} = createTester(import.meta.resolve('.'));



test({
	valid: [
		{
			name: 'does not require empty lines before or after a hashbang',
			code: `
				#!/usr/bin/env node
				const foo = 1;
			`,
		},
		{
			name: 'accepts empty lines after a hashbang',
			code: `
				#!/usr/bin/env node



				const foo = 1;
			`,
		},
	],
});
