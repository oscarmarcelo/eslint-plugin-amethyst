import createTester from '../../helpers/tester.js';



const {testValidAndInvalid} = createTester(import.meta.resolve('.'));

const parents = {
	'function declaration': {
		opening: 'function outer() {',
		closing: '}',
	},
	'function expression': {
		opening: 'const outer = function () {',
		closing: '};',
	},
};

const children = {
	'function declaration': {
		foo: 'function foo() {}',
		bar: 'function bar() {}',
		nonType: 'class Baz {}',
	},
	'class declaration': {
		foo: 'class Foo {}',
		bar: 'class Bar {}',
		nonType: 'function baz() {}',
	},
};



for (const [parentName, parentValues] of Object.entries(parents)) {
	for (const [childName, childValues] of Object.entries(children)) {
		const testCases = [
			{
				name: `two empty lines between ${childName}s with a JSDoc comment attached, inside ${parentName}s`,
				code: `
					${parentValues.opening}
						/**
						* A JSDoc comment.
						*/
						${childValues.foo}
						/**
						* Another JSDoc comment.
						*/
						${childValues.bar}
					${parentValues.closing}
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
					${parentValues.opening}
						/**
						* A JSDoc comment.
						*/
						${childValues.foo}


						/**
						* Another JSDoc comment.
						*/
						${childValues.bar}
					${parentValues.closing}
				`,
			},
			{
				name: `two empty lines between standalone JSDoc comments and ${childName}s with a JSDoc comment attached, inside ${parentName}s`,
				code: `
					${parentValues.opening}
						/**
						* A JSDoc comment.
						*/
						/**
						* Another JSDoc comment.
						*/
						${childValues.foo}
					${parentValues.closing}
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
					${parentValues.opening}
						/**
						* A JSDoc comment.
						*/


						/**
						* Another JSDoc comment.
						*/
						${childValues.foo}
					${parentValues.closing}
				`,
			},
			{
				name: `two empty lines between ${childName}s and standalone JSDoc comments, inside ${parentName}s`,
				code: `
					${parentValues.opening}
						/**
						* A JSDoc comment.
						*/

						${childValues.foo}

						/**
						* Another JSDoc comment.
						*/
					${parentValues.closing}
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
					${parentValues.opening}
						/**
						* A JSDoc comment.
						*/


						${childValues.foo}


						/**
						* Another JSDoc comment.
						*/
					${parentValues.closing}
				`,
			},
		];

		testValidAndInvalid('accepts', 'requires', testCases);
	}
}
