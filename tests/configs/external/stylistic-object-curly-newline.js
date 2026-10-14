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
			name: 'allows multiline objects',
			code: `
				const object = {
					a,
					b,
				};
			`,
		},
		{
			name: 'allows multiline object patterns',
			code: `
				const {
					a,
					b,
				} = object;
			`,
		},
	],
	invalid: [
		{
			name: 'requires objects with four properties to be multiline',
			code: `
				const object = {a, b, c, d};
			`,
			errors: [
				{messageId: 'expectedLinebreakAfterOpeningBrace'},
				{messageId: 'expectedLinebreakBeforeClosingBrace'},
			],
		},
		{
			name: 'requires object braces to be consistent when specifiers span multiple lines',
			code: `
				const object = {a, b,
					c, d};
			`,
			errors: [
				{messageId: 'expectedLinebreakAfterOpeningBrace'},
				{messageId: 'expectedLinebreakBeforeClosingBrace'},
			],
		},
	],
});


// TODO: Understand why this test fails.
//
// test({
// 	invalid: [
// 		{
// 			name: 'requires exports with four specifiers to be multiline',
// 			code: `
// 				export {a, b, c, d};
// 			`,
// 			errors: [
// 				{messageId: 'expectedLinebreakAfterOpeningBrace'},
// 				{messageId: 'expectedLinebreakBeforeClosingBrace'},
// 			],
// 		},
// 		{
// 			name: 'requires export braces to be consistent when specifiers span multiple lines',
// 			code: `
// 				export {a, b,
// 					c, d};
// 			`,
// 			errors: [
// 				{messageId: 'expectedLinebreakAfterOpeningBrace'},
// 				{messageId: 'expectedLinebreakBeforeClosingBrace'},
// 			],
// 		},
// 	],
// });


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
