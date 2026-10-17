import createTester from '../../helpers/tester.js';



const {test} = createTester(import.meta.resolve('.'));



test({
	valid: [
		{
			name: 'allows JSDoc comments without @public annotations',
			code: `
				/**
				 * Description.
				 */
				function foo() {}
			`,
		},
		{
			name: 'allows inline JSDoc comments without @public annotations',
			code: `
				/** Description. */
				function foo() {}
			`,
		},
		{
			name: 'allows ordinary block comments containing @public',
			code: `
				/*
				 * @public
				 */
				function foo() {}
			`,
		},
	],
});


test({
	valid: [
		{
			name: 'allows @public on explicit overrides',
			code: `
				/**
				 * @override
				 * @public
				 */
				function foo() {}
			`,
		},
		{
			name: 'allows @public on inherited declarations',
			code: `
				/**
				 * @inheritdoc
				 * @public
				 */
				function foo() {}
			`,
		},
		{
			name: 'allows @public mentioned in a description',
			code: `
				/**
				 * This description mentions the @public annotation.
				 */
				function foo() {}
			`,
		},
		{
			name: 'does not match similar annotation names',
			code: `
				/**
				 * @publicly visible
				 */
				function foo() {}
			`,
		},
	],
	invalid: [
		{
			name: 'removes a @public annotation',
			code: `
				/**
				 * Description.
				 * @public
				 */
				function foo() {}
			`,
			errors: [
				{messageId: 'redundant'},
			],
			output: `
				/**
				 * Description.
				 */
				function foo() {}
			`,
		},
		{
			name: 'removes a @public annotation with description',
			code: `
				/**
				 * Description.
				 * @public This annotation is redundant.
				 * @param {string} name - The name.
				 */
				function foo(name) {}
			`,
			errors: [
				{messageId: 'redundant'},
			],
			output: `
				/**
				 * Description.
				 * @param {string} name - The name.
				 */
				function foo(name) {}
			`,
		},
		{
			name: 'removes a @public annotation with a multiline description',
			code: `
				/**
				 * Description.
				 * @public This annotation is redundant,
				 * and contains multiple lines.
				 * @param {string} name - The name.
				 */
				function foo(name) {}
			`,
			errors: [
				{messageId: 'redundant'},
			],
			output: `
				/**
				 * Description.
				 * @param {string} name - The name.
				 */
				function foo(name) {}
			`,
		},
		{
			name: 'removes multiple @public annotations',
			code: `
				/**
				 * Description.
				 * @public
				 * @param {string} name - The name.
				 * @public This annotation is redundant,
				 * and contains multiple lines.
				 */
				function foo(name) {}
			`,
			errors: [
				{messageId: 'redundant'},
			],
			output: `
				/**
				 * Description.
				 * @param {string} name - The name.
				 */
				function foo(name) {}
			`,
		},
		{
			name: 'removes @public annotations with extra indentation',
			code: `
				/**
				 * Description.
				 *   @public
				 */
				function foo() {}
			`,
			errors: [
				{messageId: 'redundant'},
			],
			output: `
				/**
				 * Description.
				 */
				function foo() {}
			`,
		},
		{
			name: 'preserves empty lines around @public annotations',
			code: `
				/**
				 * Description.
				 *
				 * @public
				 *
				 * @param {string} name - The name.
				 */
				function foo(name) {}
			`,
			errors: [
				{messageId: 'redundant'},
			],
			output: `
				/**
				 * Description.
				 *
				 *
				 * @param {string} name - The name.
				 */
				function foo(name) {}
			`,
		},
		{
			name: 'removes @public annotations sharing a line with the opening delimiter',
			code: `
				/** @public
				 * @param {string} name - The name.
				 */
				function foo(name) {}
			`,
			errors: [
				{messageId: 'redundant'},
			],
			output: `
				/**
				 * @param {string} name - The name.
				 */
				function foo(name) {}
			`,
		},
		{
			name: 'removes @public annotations sharing a line with the closing delimiter',
			code: `
				/**
				 * @public */
				function foo() {}
			`,
			errors: [
				{messageId: 'redundant'},
			],
			output: `
				/**
				 */
				function foo() {}
			`,
		},
	],
});


test({
	valid: [
		{
			name: 'allows @public mentioned in an inline description',
			code: `
				/** This description mentions the @public annotation. */
				function foo() {}
			`,
		},
	],
	invalid: [
		{
			name: 'removes an inline @public annotation',
			code: `
				/** @public */
				function foo() {}
			`,
			errors: [
				{messageId: 'redundant'},
			],
			output: `
				/** */
				function foo() {}
			`,
		},
		{
			name: 'removes an inline @public annotation with a description',
			code: `
				/** @public This annotation is redundant. */
				function foo() {}
			`,
			errors: [
				{
					messageId: 'redundant',
				},
			],
			output: `
				/** */
				function foo() {}
			`,
		},
		{
			name: 'removes an inline @public annotation mentioning other anotations',
			code: `
				/** @public This annotation mentions the @param annotation. */
				function foo() {}
			`,
			errors: [
				{
					messageId: 'redundant',
				},
			],
			output: `
				/** */
				function foo() {}
			`,
		},
	],
});


test({
	invalid: [
		{
			name: 'preserves CRLF line endings',
			code: '/**\r\n * Description.\r\n * @public\r\n */\r\nfunction foo() {}\r\n',
			errors: [
				{messageId: 'redundant'},
			],
			output: '/**\r\n * Description.\r\n */\r\nfunction foo() {}\r\n',
		},
	],
});


test({
	invalid: [
		{
			name: 'fixes the correct range',
			code: `
				const foo = 1;

				/**
				 * @public
				 */
				function bar() {}
			`,
			errors: [
				{messageId: 'redundant'},
			],
			output: `
				const foo = 1;

				/**
				 */
				function bar() {}
			`,
		},
	],
});
