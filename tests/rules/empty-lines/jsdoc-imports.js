import createTester from '../../helpers/tester.js';



const {testValidAndInvalid} = createTester(import.meta.resolve('.'));



const testCases = [
	{
		name: 'one empty line between an import declaration and a JSDoc import comment',
		code: `
			import foo from 'foo';
			/**
			 * @import bar from 'bar';
			 */
		`,
		errors: [
			{
				messageId: 'require-empty-lines-after',
			},
			{
				messageId: 'require-empty-lines-before',
			},
		],
		output: `
			import foo from 'foo';

			/**
			 * @import bar from 'bar';
			 */
		`,
	},
	{
		name: 'one empty line between an import declaration and a JSDoc typedef import comment',
		code: `
			import foo from 'foo';
			/**
			 * @typedef {import('bar').Bar} Bar
			 */
		`,
		errors: [
			{
				messageId: 'require-empty-lines-after',
			},
			{
				messageId: 'require-empty-lines-before',
			},
		],
		output: `
			import foo from 'foo';

			/**
			 * @typedef {import('bar').Bar} Bar
			 */
		`,
	},
	{
		name: 'three empty lines between a JSDoc import comment and another statement',
		code: `
			/**
			 * @import foo from 'foo';
			 */
			const bar = 1;
		`,
		errors: [
			{
				messageId: 'require-empty-lines-after',
			},
		],
		output: `
			/**
			 * @import foo from 'foo';
			 */



			const bar = 1;
		`,
	},
	{
		name: 'three empty lines between a JSDoc typedef import comment and another statement',
		code: `
			/**
			 * @typedef {import('foo').Foo} Foo
			 */
			const bar = 1;
		`,
		errors: [
			{
				messageId: 'require-empty-lines-after',
			},
		],
		output: `
			/**
			 * @typedef {import('foo').Foo} Foo
			 */



			const bar = 1;
		`,
	},
	{
		name: 'three empty lines between a JSDoc import comment and function declarations',
		code: `
			function foo() {}
			/**
			 * @import {Bar} from 'bar';
			 */
			function baz() {}
		`,
		errors: [
			{
				messageId: 'require-empty-lines-after',
			},
			{
				messageId: 'require-empty-lines-before',
			},
			{
				messageId: 'require-empty-lines-after',
			},
			{
				messageId: 'require-empty-lines-before',
			},
		],
		output: `
			function foo() {}



			/**
			 * @import {Bar} from 'bar';
			 */



			function baz() {}
		`,
	},
];

testValidAndInvalid('accepts', 'requires', testCases);
