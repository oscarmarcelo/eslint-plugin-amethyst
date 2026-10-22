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
		test({
			valid: [
				{
					name: `does not apply top-level empty lines to ${childName}s inside ${parentName}s`,
					code: `
						${parentValues.opening}
							${childValues.foo}
						${parentValues.closing}
					`,
				},
			],
		});


		const testCases = [
			{
				name: `two empty lines between consecutive ${childName}s inside ${parentName}s`,
				code: `
					${parentValues.opening}
						${childValues.foo}
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
						${childValues.foo}


						${childValues.bar}
					${parentValues.closing}
				`,
			},
			{
				name: `two empty lines between a ${childName} and another declaration type inside ${parentName}s`,
				code: `
					${parentValues.opening}
						${childValues.foo}
						${childValues.nonType}
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
						${childValues.foo}


						${childValues.nonType}
					${parentValues.closing}
				`,
			},
			{
				name: `two empty lines before and after ${childName}s and other statements inside ${parentName}s`,
				code: `
					${parentValues.opening}
						const before = 1;
						${childValues.foo}
						const after = 2;
					${parentValues.closing}
				`,
				errors: [
					{
						messageId: 'require-empty-lines-before',
					},
					{
						messageId: 'require-empty-lines-after',
					},
				],
				output: `
					${parentValues.opening}
						const before = 1;


						${childValues.foo}


						const after = 2;
					${parentValues.closing}
				`,
			},
		];

		testValidAndInvalid('accepts', 'requires', testCases);


		test({
			invalid: [
				{
					name: `reports inline ${childName}s inside ${parentName}s`,
					code: `
						${parentValues.opening}
							const before = 1; ${childValues.foo} const after = 2;
						${parentValues.closing}
					`,
					errors: [
						{
							messageId: 'require-empty-lines-before',
						},
						{
							messageId: 'require-empty-lines-after',
						},
					],
					output: `
						${parentValues.opening}
							const before = 1;


							${childValues.foo}


							const after = 2;
						${parentValues.closing}
					`,
				},
				{
					name: `reports consecutive inline ${childName}s inside ${parentName}s`,
					code: `
						${parentValues.opening}
							${childValues.foo} ${childValues.bar}
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
							${childValues.foo}


							${childValues.bar}
						${parentValues.closing}
					`,
				},
				{
					name: `reports a inline ${childName} and another inline declaration type inside ${parentName}s`,
					code: `
						${parentValues.opening}
							${childValues.foo} ${childValues.nonType}
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
							${childValues.foo}


							${childValues.nonType}
						${parentValues.closing}
					`,
				},
			],
		});
	}
}
