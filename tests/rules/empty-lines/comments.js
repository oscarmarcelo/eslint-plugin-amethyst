import createTester from '../../helpers/tester.js';



const {test} = createTester(import.meta.resolve('.'));



test({
	valid: [
		{
			name: 'does not require empty lines before or after a standalone line comment',
			code: `
				// A comment.
			`,
		},
		{
			name: 'accepts empty lines before and after a standalone line comment',
			code: `
				const foo = 1;

				// A comment.

				const bar = 2;



				// A comment.



				const baz = 3
			`,
		},
		{
			name: 'does not require empty lines between ordinary statements with attached comments',
			code: `
				const foo = 1;
				// A comment.
				const bar = 2;
			`,
		},
	],
});


test({
	valid: [
		{
			name: 'does not require empty lines before or after a standalone multiline line comment',
			code: `
				// A
				// comment.
			`,
		},
		{
			name: 'accepts empty lines before and after a standalone multiline line comment',
			code: `
				const foo = 1;

				// A
				// comment.

				const bar = 2;



				// A
				// comment.



				const baz = 3
			`,
		},
	],
});


test({
	valid: [
		{
			name: 'does not require empty lines before or after a standalone block comment',
			code: `
				/*
				A comment.
				*/
			`,
		},
		{
			name: 'accepts empty lines before and after a standalone block comment',
			code: `
				const foo = 1;

				/*
				A comment.
				*/

				const bar = 2;



				/*
				A comment.
				*/



				const baz = 3
			`,
		},
	],
});

test({
	valid: [
		{
			name: 'does not require empty lines between standalone block comments',
			code: `
				/*
				A comment.
				*/
				/*
				Another comment.
				*/
			`,
		},
		{
			name: 'does not require empty lines between standalone mixed comments',
			code: `
				/*
				A comment.
				*/
				// Another comment.

				// One more comment.
				/*
				Last comment.
				*/
			`,
		},
	],
});
