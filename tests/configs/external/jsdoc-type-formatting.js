import createTester from '../../helpers/config-tester.js';



const test = createTester('external', 'jsdoc/type-formatting');



test({
	valid: [
		{
			name: 'allows one space around union pipes',
			code: `
				/**
				 * @param {string | number} value - Value.
				 */
				function foo(value) {}
			`,
		},
	],
	invalid: [
		{
			name: 'requires one space around union pipes',
			code: `
				/**
				 * @param {string|number} value - Value.
				 */
				function foo(value) {}
			`,
			errors: [
				{ruleId: 'jsdoc/type-formatting'},
			],
		},
		{
			name: 'disallows whitespace inside outer type braces',
			code: `
				/**
				 * @param { string } value - Value.
				 */
				function foo(value) {}
			`,
			errors: [
				{ruleId: 'jsdoc/type-formatting'},
			],
		},
	],
});
