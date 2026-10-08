/* eslint-disable ava/no-ignored-test-files -- Using AVA methods is part of the helper functionality. */

import test from 'ava';
import {Linter} from 'eslint';
import eslintConfigXo from 'eslint-config-xo';

import amethyst from '../../source/index.js';

import normalizeTestCase from './normalize-test-case.js';



export default function createTester(configName, ruleId) {
	const linter = new Linter();
	const config = amethyst.configs[configName];

	if (!config) {
		throw new Error(`Unknown Amethyst config: ${configName}`);
	}


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
