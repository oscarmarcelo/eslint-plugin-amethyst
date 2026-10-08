import createTester from '../../helpers/config-tester.js';



const test = createTester('external', '@stylistic/padding-line-between-statements');



test({
	valid: [
		{
			name: 'allows an empty space after a multiline block',
			code: `
				if (foo) {
					bar();
				}

				baz();
			`,
		},
	],
	invalid: [
		{
			name: 'requires an empty space after a multiline block',
			code: `
				if (foo) {
					bar();
				}
				baz();
			`,
			errors: [
				{messageId: 'expectedBlankLine'},
			],
		},
		{
			name: 'requires an empty space after a multiline function',
			code: `
				function foo() {
					bar();
				}
				const baz = 1;
			`,
			errors: [
				{messageId: 'expectedBlankLine'},
			],
		},
	],
});


test({
	valid: [
		{
			name: 'allows consecutive const declarations',
			code: `
				const a = 1;
				const b = 1;
			`,
		},
		{
			name: 'allows consecutive let declarations',
			code: `
				let a = 1;
				let b = 1;
			`,
		},
		{
			name: 'allows consecutive var declarations',
			code: `
				var a = 1;
				var b = 1;
			`,
		},
		{
			name: 'allows an empty space between const declarations',
			code: `
				const a = 1;

				const b = 1;
			`,
		},
		{
			name: 'allows an empty space between let declarations',
			code: `
				let a = 1;

				let b = 1;
			`,
		},
		{
			name: 'allows an empty space between var declarations',
			code: `
				var a = 1;

				var b = 1;
			`,
		},
	],
	invalid: [
		{
			name: 'requires an empty space before a variable',
			code: `
				foo();
				const a = 1;
			`,
			errors: [
				{messageId: 'expectedBlankLine'},
			],
		},
		{
			name: 'requires an empty space after a variable',
			code: `
				const a = 1;
				foo();
			`,
			errors: [
				{messageId: 'expectedBlankLine'},
			],
		},
	],
});


test({
	valid: [
		{
			name: 'allows an empty space between const and let',
			code: `
				const a = 1;

				let b = 1;
			`,
		},
		{
			name: 'allows an empty space between let and const',
			code: `
				let a = 1;

				const b = 1;
			`,
		},
		{
			name: 'allows an empty space between const and var',
			code: `
				const a = 1;

				var b = 1;
			`,
		},
		{
			name: 'allows an empty space between var and const',
			code: `
				var a = 1;

				const b = 1;
			`,
		},
		{
			name: 'allows an empty space between let and var',
			code: `
				let a = 1;

				var b = 1;
			`,
		},
		{
			name: 'allows an empty space between var and let',
			code: `
				var a = 1;

				let b = 1;
			`,
		},
	],
	invalid: [
		{
			name: 'requires an empty space between const and let',
			code: `
				const a = 1;
				let b = 1;
			`,
			errors: [
				{messageId: 'expectedBlankLine'},
			],
		},
		{
			name: 'requires an empty space between let and const',
			code: `
				let a = 1;
				const b = 1;
			`,
			errors: [
				{messageId: 'expectedBlankLine'},
			],
		},
		{
			name: 'requires an empty space between const and var',
			code: `
				const a = 1;
				var b = 1;
			`,
			errors: [
				{messageId: 'expectedBlankLine'},
			],
		},
		{
			name: 'requires an empty space between var and const',
			code: `
				var a = 1;
				const b = 1;
			`,
			errors: [
				{messageId: 'expectedBlankLine'},
			],
		},
		{
			name: 'requires an empty space between let and var',
			code: `
				let a = 1;
				var b = 1;
			`,
			errors: [
				{messageId: 'expectedBlankLine'},
			],
		},
		{
			name: 'requires an empty space between var and let',
			code: `
				var a = 1;
				let b = 1;
			`,
			errors: [
				{messageId: 'expectedBlankLine'},
			],
		},
	],
});


test({
	valid: [
		{
			name: 'allows an empty space between a variable and a return',
			code: `
				function foo () {
					const a = 1;

					return a;
				}
			`,
		},
		{
			name: 'allows an empty space between a statement and a return',
			code: `
				function foo () {
					foo();

					return;
				}
			`,
		},
	],
	invalid: [
		{
			name: 'requires an empty space before a return',
			code: `
				function foo () {
					const a = 1;
					return a;
				}
			`,
			errors: [
				{messageId: 'expectedBlankLine'},
			],
		},
		{
			name: 'requires an empty space between a statement and a return',
			code: `
				function foo () {
					foo();
					return;
				}
			`,
			errors: [
				{messageId: 'expectedBlankLine'},
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
				const a = 1;
				let b = 1;
				var c = 1;
			`,
		},
	],
});
