import createTester from '../../helpers/config-tester.js';



const test = createTester('external', 'jsdoc/require-returns');



test({
	valid: [
		{
			name: 'allows a @return annotation when a value is returned',
			code: `
				/**
				 * Description.
				 *
				 * @returns {string} The result.
				 */
				function foo() {
					return 'foo';
				}
			`,
		},
		{
			name: 'does not require a @return annotation for a function without a value return',
			code: `
				/**
				 * Description
				 */
				function foo() {
					bar();
				}
			`,
		},
	],
	invalid: [
		{
			name: 'requires a @return annotation when a value is returned',
			code: `
				/**
				 * Description.
				 */
				function foo() {
					return 'foo';
				}
			`,
			errors: [
				{ruleId: 'jsdoc/require-returns'},
			],
		},
	],
});
