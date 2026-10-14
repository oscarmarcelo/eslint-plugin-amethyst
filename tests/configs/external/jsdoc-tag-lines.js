import createTester from '../../helpers/config-tester.js';



const test = createTester('external', 'jsdoc/tag-lines');



test({
	valid: [
		{
			name: 'allows an empty line after the description',
			code: `
				/**
				 * Description.
				 *
				 * @param {string} value - Value.
				 */
				function foo(value) {}
			`,
		},
		{
			name: 'allows consecutive tags',
			code: `
				/**
				 * Description.
				 *
				 * @param {string} value - Value.
				 * @returns {string} Value.
				 */
				function foo(value) {
					return value;
				}
			`,
		},
	],
	invalid: [
		{
			name: 'requires an empty line after the description',
			code: `
				/**
				 * Description.
				 * @param {string} value - Value.
				 */
				function foo(value) {}
			`,
			errors: [
				{message: 'Expected 1 lines after block description'},
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
				 * Description.
				 * @param {string} value - Value.
				 */
				function foo(value) {}
			`,
		},
	],
});
