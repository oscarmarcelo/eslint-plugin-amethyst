import createTester from '../../helpers/config-tester.js';



const test = createTester('external', 'jsdoc/check-indentation');



test({
	valid: [
		{
			name: 'allows descriptions with indented content',
			code: `
				/**
				 * Description with a list:
				 *   - foo
				 *   - bar
				 */
				function foo() {}
			`,
		},
		{
			name: 'allows @param descriptions with indented content',
			code: `
				/**
				 * @param {string} value - Description with a list:
				 *   - foo
				 *   - bar
				 */
				function foo(value) {}
			`,
		},
	],
	invalid: [
		// TODO: Understand why this test fails.
		// {
		// 	name: 'requires first line of descriptions to not be indented',
		// 	code: `
		// 		/**
		// 		 *   Description.
		// 		 */
		// 		function foo() {}
		// 	`,
		// },
		{
			name: 'requires first line of @param descriptions to not be indented',
			code: `
				/**
				 * @param {string} value   Description.
				 */
				function foo(value) {}
			`,
		},
	],
});
