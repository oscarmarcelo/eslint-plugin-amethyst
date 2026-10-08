import createTester from '../../helpers/config-tester.js';



const test = createTester('external', 'package-json/sort-properties');



test({
	valid: [
		{
			name: 'allows correctly ordered properties',
			filename: 'package.json',
			code: `
				{
					"name": "example",
					"version": "1.0.0",
					"description": "Example"
				}
			`,
		},
	],
	invalid: [
		{
			name: 'requires correctly ordered properties',
			filename: 'package.json',
			code: `
				{
					"version": "1.0.0",
					"name": "example"
				}
			`,
			errors: [
				{messageId: 'sort-properties'},
			],
		},
	],
});


test({
	valid: [
		{
			name: 'doesn\'t affect JavaScript files',
			filename: 'test.js',
			code: `
				const packageJson = {
					version: '1.0.0',
					name: 'example',
				};
			`,
		},
		{
			name: 'doesn\'t affect files other than package.json',
			filename: 'test.json',
			code: `
				{
					"version": "1.0.0",
					"name": "example"
				}
			`,
		},
	],
	invalid: [
		{
			name: 'applies to nested package.json files',
			filename: 'packages/foo/package.json',
			code: `
				{
					"version": "1.0.0",
					"name": "example"
				}
			`,
			errors: [
				{messageId: 'sort-properties'},
			],
		},
	],
});
