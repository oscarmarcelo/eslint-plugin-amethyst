/* eslint-disable ava/no-ignored-test-files -- Using AVA methods is part of the helper functionality. */

import test from 'ava';
import {Linter} from 'eslint';
import eslintConfigXo from 'eslint-config-xo';

import amethyst from '../../source/index.js';

import normalizeTestCase from './normalize-test-case.js';



/**
 * Create the helper to test one rule in one preset.
 *
 * @internal
 *
 * @param {string} configName - Name of the preset to test.
 * @param {string} ruleId - Fully qualified ESLint rule ID.
 *
 * @returns {(options: {valid?: unknown[], invalid?: unknown[]}) => void} The test helper.
 */
export default function createTester(configName, ruleId) {
	const linter = new Linter();
	const config = amethyst.configs[configName];

	if (!config) {
		throw new Error(`Unknown Amethyst config: ${configName}`);
	}


	/**
	 * Run XO and the selected preset, returning only diagnostics from the target rule.
	 *
	 * @private
	 *
	 * @param {string} code - Source code to lint.
	 * @param {string} [filename = 'test.js'] - The virtual filename used by ESLint.
	 *
	 * @returns {import('eslint').Linter.LintMessage[]} Diagnostics emitted by the selected rule.
	 */
	function lint(code, filename = 'test.js') {
		return linter.verify(
			code,
			[
				...eslintConfigXo(),
				...config,
			],
			{
				filename,
			},
		)
			.filter(message => message.ruleId === ruleId);
	}


	return options => {
		for (const [index, {name, filename, code}] of (options.valid ?? []).map(testCase => normalizeTestCase(testCase)).entries()) {
			test(`valid(${index + 1}): ${name}`, t => {
				const messages = lint(code, filename);

				t.is(messages.length, 0, `Expected no ${ruleId} errors, but received ${messages.length}.`);
			});
		}

		for (const [index, {name, filename, code, errors}] of (options.invalid ?? []).map(testCase => normalizeTestCase(testCase)).entries()) {
			test(`invalid(${index + 1}): ${name}`, t => {
				const messages = lint(code, filename);

				const expectedErrors = typeof errors === 'number'
					? Array.from({length: errors}, () => ({}))
					: errors;

				t.is(messages.length, expectedErrors.length);

				for (const [errorIndex, error] of expectedErrors.entries()) {
					const actual = messages[errorIndex];

					for (const [property, value] of Object.entries(error)) {
						t.is(actual[property], value);
					}
				}
			});
		}
	};
}
