import outdent from 'outdent';

/**
 * @import {RuleTester} from 'eslint';
 */



/**
 * Normalize a test case and dedent its source and expected output.
 *
 * @internal
 *
 * @param {RuleTester.ValidTestCase | RuleTester.InvalidTestCase} testCase - The test case object.
 *
 * @returns {RuleTester.ValidTestCase | RuleTester.InvalidTestCase} The normalized test case.
 */
export default function normalizeTestCase(testCase) {
	testCase.code &&= testCase.code.includes('\r')
		? testCase.code
		: outdent.string(testCase.code);

	testCase.output &&= testCase.output.includes('\r')
		? testCase.output
		: outdent.string(testCase.output);

	return testCase;
}
