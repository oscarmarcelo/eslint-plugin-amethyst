import {Linter} from 'eslint';
import outdent from 'outdent';

/**
 * @import {Rule} from 'eslint';
 * @import {Node} from 'estree';
 */



const linter = new Linter();



/**
 * Run a callback while ESLint parses the supplied code.
 *
 * @internal
 *
 * @param {object} options - The test options.
 * @param {string} options.code - Source code to parse.
 * @param {string} [options.visitor] - Visitor name in which to run the callback.
 * @param {(context: Rule.RuleContext, node?: Node) => unknown} options.run - Callback that returns the value to capture.
 * @param {boolean} [options.dedent = true] - Whether to remove common indentation from the source.
 *
 * @returns {unknown} The value returned by the callback.
 */
export default function utilityTester({code, visitor, run, dedent = true}) {
	let result;

	linter.verify(
		dedent
			? outdent.string(code)
			: code,
		{
			languageOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
			plugins: {
				test: {
					rules: {
						test: {
							create(context) {
								if (visitor) {
									return {
										[visitor](node) {
											result = run(context, node);
										},
									};
								}

								result = run(context);

								return {};
							},
						},
					},
				},
			},
			rules: {
				'test/test': 'error',
			},
		},
	);

	return result;
}
