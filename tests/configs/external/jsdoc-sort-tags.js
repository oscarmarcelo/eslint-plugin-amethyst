import createTester from '../../helpers/config-tester.js';



const test = createTester('external', 'jsdoc/sort-tags');



test({
	valid: [
		{
			name: 'allows tags in the configured order and groups',
			code: `
				/**
				 * Description.
				 *
				 * @internal
				 *
				 * @param {string} bar - Value.
				 * @param {string} baz - Value.
				 *
				 * @returns {string} Value.
				 */
				function foo(bar, baz) {
					return bar + baz;
				}
			`,
		},
	],
	invalid: [
		{
			name: 'requires tags to follow the configured order',
			code: `
				/**
				 * Description.
				 *
				 * @param {string} bar - Value.
				 *
				 * @internal
				 */
				function foo(bar) {}
			`,
			errors: [
				// eslint-disable-next-line @stylistic/max-len
				{message: 'Tags are not in the prescribed order: internal, private, protected, package, access, public, typedef, callback, param, arg, argument, property, prop, returns, return, -other'},
			],
		},
		{
			name: 'requires tags to follow the configured groups',
			code: `
				/**
				 * Description.
				 *
				 * @internal
				 *
				 * @param {string} bar - Value.
				 *
				 * @param {string} baz - Value.
				 *
				 * @returns {string} Value.
				 */
				function foo(bar, baz) {
					return bar + baz;
				}
			`,
			errors: [
				{message: 'Intra-group tags have unexpected whitespace'},
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
				 *
				 * @param {string} bar - Value.
				 *
				 * @internal
				 */
				function foo(bar) {}
			`,
		},
	],
});
