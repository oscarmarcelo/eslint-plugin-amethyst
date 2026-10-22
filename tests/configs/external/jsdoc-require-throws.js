import createTester from '../../helpers/config-tester.js';



const test = createTester('external', 'jsdoc/require-throws');



test({
	valid: [
		{
			name: 'allows a @throws annotation for a function that throws',
			code: `
				/**
				 * Description.
				 *
				 * @throws {Error} If the operation fails.
				 */
				function foo() {
					throw new Error('Message.');
				}
			`,
		},
	],
	invalid: [
		{
			name: 'requires a @throws annotation for a function that throws',
			code: `
				/**
				 * Description.
				 */
				function foo() {
					throw new Error('Message.');
				}
			`,
			errors: [
				{ruleId: 'jsdoc/require-throws'},
			],
		},
	],
});
