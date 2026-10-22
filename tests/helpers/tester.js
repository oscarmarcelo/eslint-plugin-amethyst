import path from 'node:path';
import url from 'node:url';

import test from 'ava';
import AvaRuleTester from 'eslint-ava-rule-tester';

import amethyst from '../../source/index.js';

import normalizeTestCase from './normalize-test-case.js';

/**
 * @import {RuleTester} from 'eslint';
 */



/**
 * A function that registers tests for an ESLint rule.
 *
 * @callback Test
 *
 * @param {object} options - The valid and invalid test cases.
 * @param {RuleTester.ValidTestCase[]} [options.valid] - Test cases expected to pass.
 * @param {RuleTester.InvalidTestCase[]} [options.invalid] - Test cases expected to fail.
 *
 * @returns {void}
 */



/**
 * A function that registers valid and invalid tests from the same test cases.
 *
 * @callback TestValidAndInvalid
 *
 * @param {string} validPrefix - Prefix for valid test names.
 * @param {string} invalidPrefix - Prefix for invalid test names.
 * @param {RuleTester.InvalidTestCase[]} testCases - The test cases to register.
 * Valid test cases will use the `output` property as the `code` property.
 *
 * @returns {void}
 */



/**
 * The test helpers returned by {@link createTester}.
 *
 * @typedef {object} TestHelpers
 *
 * @property {Test} test - Register ESLint rule tests.
 * @property {TestValidAndInvalid} testValidAndInvalid - Register paired valid and invalid tests.
 */



/**
 * Create helpers to test the package rules.
 *
 * @internal
 *
 * @param {URL} urlValue - The `import.meta.url` of the test file,
 * The last segment of the URL will be used to determine the rule ID to test.
 *
 * @returns {TestHelpers} The test helpers.
 *
 * @throws {Error} If the rule is unknown.
 */
export default function createTester(urlValue) {
	const ruleId = path.basename(url.fileURLToPath(urlValue), '.js');
	const rule = amethyst.rules[ruleId];

	if (!rule) {
		throw new Error(`Unknown Amethyst rule: ${ruleId}`);
	}

	const tester = new AvaRuleTester(test, {
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
		},
	});


	/**
	 * The test callback.
	 *
	 * @type {Test}
	 */
	const testFunction = options => {
		tester.run(ruleId, rule, {
			...options,
			valid: (options.valid ?? []).map(testCase => normalizeTestCase(testCase)),
			invalid: (options.invalid ?? []).map(testCase => normalizeTestCase(testCase)),
		});
	};


	return {
		test: testFunction,
		testValidAndInvalid(validPrefix, invalidPrefix, testCases) {
			for (const testCase of testCases) {
				const options = {...testCase};

				delete options.errors;
				delete options.output;

				testFunction({
					valid: [{
						...options,
						name: `${validPrefix} ${testCase.name}`,
						code: testCase.output,
					}],
					invalid: [{
						...testCase,
						name: `${invalidPrefix} ${testCase.name}`,
					}],
				});
			}
		},
	};
}
