import createTester from '../../helpers/tester.js';



const {test} = createTester(import.meta.resolve('.'));


test({
	invalid: [
		{
			name: 'correctly counts the spaces between declarations',
			code: `
				function foo() {}
				function bar() {}


				function baz() {}
			`,
			errors: [
				{
					messageId: 'require-empty-lines-after',
					data: {
						expected: 3,
						lines: 'lines',
						type: 'function declaration',
						count: 0,
					},
				},
				{
					messageId: 'require-empty-lines-before',
					data: {
						expected: 3,
						lines: 'lines',
						type: 'function declaration',
						count: 0,
					},
				},
				{
					messageId: 'require-empty-lines-after',
					data: {
						expected: 3,
						lines: 'lines',
						type: 'function declaration',
						count: 2,
					},
				},
				{
					messageId: 'require-empty-lines-before',
					data: {
						expected: 3,
						lines: 'lines',
						type: 'function declaration',
						count: 2,
					},
				},
			],
			output: `
				function foo() {}



				function bar() {}



				function baz() {}
			`,
		},
		{
			name: 'correctly counts the spaces between inline declarations',
			code: `
				function foo() {} function bar() {}
			`,
			errors: [
				{
					messageId: 'require-empty-lines-after',
					data: {
						expected: 3,
						lines: 'lines',
						type: 'function declaration',
						count: 0,
					},
				},
				{
					messageId: 'require-empty-lines-before',
					data: {
						expected: 3,
						lines: 'lines',
						type: 'function declaration',
						count: 0,
					},
				},
			],
			output: `
				function foo() {}



				function bar() {}
			`,
		},
	],
});
