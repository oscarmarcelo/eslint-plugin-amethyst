import createTester from '../../helpers/tester.js';



const {test} = createTester(import.meta.resolve('.'));



test({
	invalid: [
		{
			name: 'correctly handles blank lines with whitespace other than newlines',
			code: 'const foo = 1;\n\t  \nfunction bar() {}',
			errors: [
				{
					messageId: 'require-empty-lines-before',
				},
			],
			output: `
				const foo = 1;



				function bar() {}
			`,
		},
	],
});


test({
	invalid: [
		{
			name: 'preserves CRLF line endings when fixing empty lines',
			code: 'const foo = 1;\r\nfunction bar() {}',
			errors: [
				{
					messageId: 'require-empty-lines-before',
				},
			],
			output: 'const foo = 1;\r\n\r\n\r\n\r\nfunction bar() {}',
		},
	],
});
