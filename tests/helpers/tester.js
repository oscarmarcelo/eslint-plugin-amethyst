import path from 'node:path';
import url from 'node:url';

import test from 'ava';
import AvaRuleTester from 'eslint-ava-rule-tester';

import amethyst from '../../source/index.js';

import normalizeTestCase from './normalize-test-case.js';



export default function createTester(importMeta) {
	const ruleId = path.basename(url.fileURLToPath(importMeta.url), '.js');
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

	return options => {
		tester.run(ruleId, rule, {
			...options,
			valid: (options.valid ?? []).map(testCase => normalizeTestCase(testCase)),
			invalid: (options.invalid ?? []).map(testCase => normalizeTestCase(testCase)),
		});
	};
}
