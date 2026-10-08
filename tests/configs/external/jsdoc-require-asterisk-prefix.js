import createTester from '../../helpers/config-tester.js';



const test = createTester('external', 'jsdoc/require-asterisk-prefix');



test({
	valid: [
		{
			name: 'allows an asterisk prefix',
			code: `
				/**
				 * Description.
				 */
				function foo() {}
			`,
		},
	],
	invalid: [
		{
			name: 'requires an asterisk prefix',
			code: `
				/**
				 Description.
				 */
				function foo() {}
			`,
			errors: [
				{message: 'Expected JSDoc line to have the prefix.'},
			],
		},
	],
});


test({
	valid: [
		{
			name: 'doesn\'t affect non-JavaScript files',
			filename: 'test.txt',
			code: `
				/**
				 Description.
				 */
				function foo() {}
			`,
		},
	],
});
