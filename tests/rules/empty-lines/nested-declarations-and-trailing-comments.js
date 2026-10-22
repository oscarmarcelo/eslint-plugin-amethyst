import createTester from '../../helpers/tester.js';



const {test, testValidAndInvalid} = createTester(import.meta.resolve('.'));

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
				name: `trailing line comments before a ${childName} inside ${parentName}s`,
				code: `
					${parentValues.opening}
						${childValues.foo} // A trailing comment
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
						${childValues.foo} // A trailing comment


						${childValues.bar}
					${parentValues.closing}
				`,
			},
			{
				name: `trailing block comments before a ${childName} inside ${parentName}s`,
				code: `
					${parentValues.opening}
						${childValues.foo} /* A trailing comment */
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
						${childValues.foo} /* A trailing comment */


						${childValues.bar}
					${parentValues.closing}
				`,
			},
			{
				name: `multiline trailing block comments before a ${childName} inside ${parentName}s`,
				code: `
					${parentValues.opening}
						${childValues.foo} /*
						A trailing comment
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
						${childValues.foo} /*
						A trailing comment
						*/


						${childValues.bar}
					${parentValues.closing}
				`,
			},
			{
				name: `multiple trailing block comments before a ${childName} inside ${parentName}s`,
				code: `
					${parentValues.opening}
						${childValues.foo} /* A trailing comment */ /* Another trailing comment */
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
						${childValues.foo} /* A trailing comment */ /* Another trailing comment */


						${childValues.bar}
					${parentValues.closing}
				`,
			},
			{
				name: `multiple trailing mixed comments before a ${childName} inside ${parentName}s`,
				code: `
					${parentValues.opening}
						${childValues.foo} /* A trailing comment */ // Another trailing comment
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
						${childValues.foo} /* A trailing comment */ // Another trailing comment


						${childValues.bar}
					${parentValues.closing}
				`,
			},
			{
				name: `multiple multiline trailing block comments before a ${childName} inside ${parentName}s`,
				code: `
					${parentValues.opening}
						${childValues.foo} /*
						A trailing comment
						*/ /*
						Another trailing comment
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
						${childValues.foo} /*
						A trailing comment
						*/ /*
						Another trailing comment
						*/


						${childValues.bar}
					${parentValues.closing}
				`,
			},
			{
				name: `multiple multiline trailing mixed comments before a ${childName} inside ${parentName}s`,
				code: `
					${parentValues.opening}
						${childValues.foo} /*
						A trailing comment
						*/ // Another trailing comment
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
						${childValues.foo} /*
						A trailing comment
						*/ // Another trailing comment


						${childValues.bar}
					${parentValues.closing}
				`,
			},
		];

		testValidAndInvalid('accepts', 'preserves', testCases);


		test({
			invalid: [
				{
					name: `preserves trailing block comments before an inline ${childName} inside ${parentName}s`,
					code: `
						${parentValues.opening}
							${childValues.foo} /* A trailing comment */ ${childValues.bar}
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
							${childValues.foo} /* A trailing comment */


							${childValues.bar}
						${parentValues.closing}
					`,
				},
				{
					name: `preserves trailing multiline block comments before an inline ${childName} inside ${parentName}s`,
					code: `
						${parentValues.opening}
							${childValues.foo} /*
							A trailing comment
							*/ ${childValues.bar}
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
							${childValues.foo} /*
							A trailing comment
							*/


							${childValues.bar}
						${parentValues.closing}
					`,
				},
				{
					name: `preserves multiple trailing block comments before an inline ${childName} inside ${parentName}s`,
					code: `
						${parentValues.opening}
							${childValues.foo} /* A trailing comment */ /* Another trailing comment */ ${childValues.bar}
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
							${childValues.foo} /* A trailing comment */ /* Another trailing comment */


							${childValues.bar}
						${parentValues.closing}
					`,
				},
				{
					name: `preserves multiple trailing multiline block comments before an inline ${childName} inside ${parentName}s`,
					code: `
						${parentValues.opening}
							${childValues.foo} /*
							A trailing comment
							*/ /*
							Another trailing comment
							*/ ${childValues.bar}
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
							${childValues.foo} /*
							A trailing comment
							*/ /*
							Another trailing comment
							*/


							${childValues.bar}
						${parentValues.closing}
					`,
				},
			],
		});
	}
}
