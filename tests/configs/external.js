import test from 'ava';

import external from '../../source/configs/external.js';
import createTester from '../helpers/config-tester.js';



createTester('external', '@stylistic/no-multiple-empty-lines')({
	valid: [
		{
			name: '2 lines',
			code: `
				const foo = 1;


				const bar = 2;
			`,
		},
		{
			name: '3 lines',
			code: `
				const foo = 1;



				const bar = 2;
			`,
		},
	],
	invalid: [
		{
			name: '4 lines',
			code: `
				const foo = 1;




				const bar = 2;
			`,
			errors: [
				{messageId: 'consecutiveBlank'},
			],
		},
	],
});


createTester('external', '@stylistic/object-curly-newline')({
	valid: [
		'import {a, b} from \'c\';',
		{
			name: 'doesn\'t affect multiline objects',
			code: `
				const object = {
					a,
					b,
				};
			`,
		},
	],
	invalid: [
		{
			code: `
				import {
					a,
					b,
				} from 'c';
			`,
			errors: [
				{messageId: 'unexpectedLinebreakAfterOpeningBrace'},
				{messageId: 'unexpectedLinebreakBeforeClosingBrace'},
			],
		},
	],
});


createTester('external', 'import-x/order')({
	valid: [
		`
			import fs from 'node:fs';

			import bar from 'bar';
			import foo from 'foo';
		`,
	],
	invalid: [
		{
			name: 'requires a blank line between import groups',
			code: `
				import fs from 'node:fs';
				import foo from 'foo';
			`,
			errors: [
				{messageId: 'oneLineBetweenGroups'},
			],
		},
		{
			name: 'sorts imports alphabetically',
			code: `
				import b from 'b';
				import a from 'a';
			`,
			errors: [
				{messageId: 'order'},
			],
		},
		{
			name: 'sorts named imports alphabetically',
			code: `
				import {
					b,
					a,
				} from 'foo';
			`,
			errors: [
				{messageId: 'order'},
			],
		},
	],
});


createTester('external', 'jsdoc/require-asterisk-prefix')({
	valid: [
		`
			/**
			 * Description.
			 */
			function foo() {}
		`,
	],
	invalid: [
		{
			code: `
				/**
				 Description.
				 */
				function foo() {}
			`,
			errors: [
				{message: 'Expected JSDoc line to have the prefix.'},
			],
		},
	],
});


createTester('external', 'no-console')({
	valid: [
		'console.warn(\'warning\');',
		'console.error(\'error\');',
	],
	invalid: [
		{
			code: 'console.log(\'message\');',
			errors: [
				{
					messageId: 'limited',
					severity: 1,
				},
			],
		},
		{
			code: 'console.info(\'message\');',
			errors: [
				{
					messageId: 'limited',
					severity: 1,
				},
			],
		},
	],
});


createTester('external', 'markdown/heading-increment')({
	valid: [
		{
			filename: 'README.md',
			code: `
				# Heading
				## Heading
			`,
		},
		{
			name: 'Doesn\'t affect non-Markdown files',
			filename: 'test.js',
			code: 'const heading = "# Heading";',
		},
		{
			name: 'Doesn\'t affect non-Markdown files',
			filename: 'README.txt',
			code: '# Heading\n### Skipped heading',
		},
	],
	invalid: [
		{
			filename: 'test.md',
			code: `
				# Heading
				### Skipped heading
			`,
			errors: [
				{messageId: 'skippedHeading'},
			],
		},
	],
});


createTester('external', 'package-json/sort-properties')({
	valid: [
		{
			filename: 'package.json',
			code: `
				{
					"name": "example",
					"version": "1.0.0",
					"description": "Example"
				}
			`,
		},
		{
			name: 'Doesn\'t affect files other than package.json',
			filename: 'test.js',
			code: 'const packageJson = {version: "1.0.0", name: "example"};',
		},
		{
			name: 'Doesn\'t affect files other than package.json',
			filename: 'package.json.txt',
			code: '{"version": "1.0.0", "name": "example"}',
		},
	],
	invalid: [
		{
			filename: 'package.json',
			code: `
				{
					"version": "1.0.0",
					"name": "example"
				}
			`,
			errors: [
				{messageId: 'sort-properties'},
			],
		},
	],
});


test('configures package.json rules for package-json', t => {
	const configuration = external.find(configuration => configuration.scope === 'package-json');

	t.truthy(configuration);
	t.deepEqual(configuration.files, ['**/package.json']);
	t.is(configuration.language, 'json/json');
});
