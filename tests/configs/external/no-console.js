import createTester from '../../helpers/config-tester.js';



const test = createTester('external', 'no-console');



test({
	valid: [
		{
			name: 'allows console.warn()',
			code: `
				console.warn('warning');
			`,
		},
		{
			name: 'allows console.error()',
			code: `
				console.error('error');
			`,
		},
	],
	invalid: [
		{
			name: 'warns for console.log()',
			code: `
				console.log('message');
			`,
			errors: [
				{
					messageId: 'limited',
					severity: 1,
				},
			],
		},
		{
			name: 'warns for console.info()',
			code: `
				console.info('message');
			`,
			errors: [
				{
					messageId: 'limited',
					severity: 1,
				},
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
				console.log('message');
			`,
		},
	],
});
