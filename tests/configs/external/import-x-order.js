import createTester from '../../helpers/config-tester.js';



const test = createTester('external', 'import-x/order');



test({
	valid: [
		{
			name: 'allows a blank line between import groups',
			code: `
				import fs from 'node:fs';

				import foo from 'foo';
			`,
		},
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
	],
});


test({
	valid: [
		{
			name: 'allows alphabetically sorted imports',
			code: `
				import a from 'a';
				import b from 'b';
			`,
		},
	],
	invalid: [
		{
			name: 'requires alphabetically sorted imports',
			code: `
				import b from 'b';
				import a from 'a';
			`,
			errors: [
				{messageId: 'order'},
			],
		},
	],
});


test({
	valid: [
		{
			name: 'allows alphabetically sorted named imports',
			code: `
				import {
					a,
					b,
				} from 'foo';
			`,
		},
	],
	invalid: [
		{
			name: 'requires alphabetically sorted named imports',
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


test({
	valid: [
		{
			name: 'doesn\'t affect non-JavaScript files',
			filename: 'test.txt',
			code: `
				import b from 'b';
				import a from 'a';
			`,
		},
	],
});
