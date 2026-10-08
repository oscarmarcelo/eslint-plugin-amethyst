import createTester from '../../helpers/config-tester.js';



const test = createTester('external', '@stylistic/object-curly-newline');



test({
	valid: [
		{
			name: 'allows single-line imports',
			code: `
				import {a, b} from 'c';
			`,
		},
	],
	invalid: [
		{
			name: 'requires imports to stay on one line',
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


test({
	valid: [
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
});


test({
	valid: [
		{
			name: 'doesn\'t affect non-JavaScript files',
			filename: 'test.txt',
			code: `
				import {
					a,
					b,
				} from 'foo';
			`,
		},
	],
});
