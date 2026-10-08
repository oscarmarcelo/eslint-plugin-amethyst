import createTester from '../../helpers/config-tester.js';



const test = createTester('external', 'markdown/heading-increment');



test({
	valid: [
		{
			name: 'allows consecutive headings',
			filename: 'test.md',
			code: `
				# Heading
				## Heading
			`,
		},
	],
	invalid: [
		{
			name: 'requires heading levels to increment by one',
			filename: 'test.md',
			code: `
				# Heading
				### Skipped heading
			`,
			errors: [
				{messageId: 'skippedHeading'},
			],
		},
	],
});


test({
	valid: [
		{
			name: 'doesn\'t affect JavaScript files',
			filename: 'test.js',
			code: 'const heading = "# Heading";',
		},
		{
			name: 'doesn\'t affect text files',
			filename: 'test.txt',
			code: `
				# Heading
				### Skipped heading
			`,
		},
	],
});
