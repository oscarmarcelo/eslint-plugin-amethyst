import createTester from '../../helpers/config-tester.js';



const test = createTester('external', 'jsdoc/require-description-complete-sentence');



test({
	valid: [
		{
			name: 'allows complete sentences in descriptions',
			code: `
				/**
				 * Description.
				 *
				 * @param {string} value - Value.
				 *
				 * @returns {string} Result.
				 */
				function foo(value) {
					return value;
				}
			`,
		},
	],
	invalid: [
		{
			name: 'requires a complete sentence in the main description',
			code: `
				/**
				 * Description
				 */
				function foo() {}
			`,
			errors: [
				{message: 'Sentences must end with a period.'},
			],
		},
		{
			name: 'requires a complete sentence in parameter descriptions',
			code: `
				/**
				 * Description.
				 *
				 * @param {string} value - Value
				 */
				function foo(value) {}
			`,
			errors: [
				{message: 'Sentences must end with a period.'},
			],
		},
	],
});
