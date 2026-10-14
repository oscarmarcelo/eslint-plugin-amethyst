import createTester from '../../helpers/tester.js';



const {test, testValidAndInvalid} = createTester(import.meta.resolve('.'));



test({
	valid: [
		{
			name: 'does not require empty lines between import declarations',
			code: `
				import foo from 'foo';
				import bar from 'bar';
			`,
		},
		{
			name: 'does not require empty lines after imports when no code follows',
			code: `
				import foo from 'foo';
			`,
		},
	],
});


const testCases = [
	{
		name: 'three empty lines after the last import declaration',
		code: `
			import foo from 'foo';
			import bar from 'bar';
			const baz = 1;
		`,
		errors: [
			{
				messageId: 'require-empty-lines-after',
			},
		],
		output: `
			import foo from 'foo';
			import bar from 'bar';



			const baz = 1;
		`,
	},
];

testValidAndInvalid('accepts', 'requires', testCases);


test({
	valid: [
		{
			name: 'comments between import declarations do not break the group',
			code: `
				import foo from 'foo';
				// A comment.
				import bar from 'bar';
			`,
		},
	],
	invalid: [
		{
			name: 'does not interfere with comments attached to import declarations',
			code: `
				// A comment.
				import foo from 'foo';
				const bar = 1;
			`,
			errors: [
				{
					messageId: 'require-empty-lines-after',
				},
			],
			output: `
				// A comment.
				import foo from 'foo';



				const bar = 1;
			`,
		},
		{
			name: 'does not interfere with comments attached to the next statement',
			code: `
				import foo from 'foo';
				// A comment.
				const bar = 1;
			`,
			errors: [
				{
					messageId: 'require-empty-lines-after',
				},
			],
			output: `
				import foo from 'foo';



				// A comment.
				const bar = 1;
			`,
		},
	],
});
