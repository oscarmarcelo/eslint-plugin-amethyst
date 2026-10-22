import createTester from '../../helpers/config-tester.js';



const test = createTester('external', 'jsdoc/require-hyphen-before-param-description');



test({
	valid: [
		{
			name: 'allows hyphens before @param descriptions',
			code: `
				/**
				 * @param {string} value - Value.
				 */
				function foo(value) {}
			`,
		},
		{
			name: 'allows hyphens before @property descriptions',
			code: `
				/**
				 * @property {string} value - Value.
				 */
			`,
		},
		{
			name: 'does not allow hyphens before @returns descriptions',
			code: `
				/**
				 * @returns {string} Result.
				 */
				function foo() {
					return 'foo';
				}
			`,
		},
		{
			name: 'does not allow hyphens before @yields descriptions',
			code: `
				/**
				 * @yields {string} Result.
				 */
				function* foo() {
					yield 'foo';
				}
			`,
		},
	],
	invalid: [
		{
			name: 'requires a hyphen before @param descriptions',
			code: `
				/**
				 * @param {string} value Value.
				 */
				function foo(value) {}
			`,
			errors: [
				{ruleId: 'jsdoc/require-hyphen-before-param-description'},
			],
		},
		{
			name: 'requires a hyphen before @property descriptions',
			code: `
				/**
				 * @property {string} value Value.
				 */
			`,
			errors: [
				{ruleId: 'jsdoc/require-hyphen-before-param-description'},
			],
		},
		{
			name: 'disallows a hyphen before @returns descriptions',
			code: `
				/**
				 * @returns {string} - Result.
				 */
				function foo() {
					return 'foo';
				}
			`,
			errors: [
				{ruleId: 'jsdoc/require-hyphen-before-param-description'},
			],
		},
		// TODO: Understand why this test fails.
		// {
		// 	name: 'disallows a hyphen before @yields descriptions',
		// 	code: `
		// 		/**
		// 		 * @yields {string} - Result.
		// 		 */
		// 		function* foo() {
		// 			yield 'foo';
		// 		}
		// 	`,
		// 	errors: [
		// 		{ruleId: 'jsdoc/require-hyphen-before-param-description'},
		// 	],
		// },
	],
});
