import test from 'ava';

import normalizeTestCase from '../helpers/normalize-test-case.js';



test('outdents code and output', t => {
	const result = normalizeTestCase({
		code: `
			const foo = 1;
			const bar = 2;
		`,
		output: `
			const foo = 1;
			const bar = 3;
		`,
	});

	t.is(result.code, 'const foo = 1;\nconst bar = 2;');
	t.is(result.output, 'const foo = 1;\nconst bar = 3;');
});


test('preserves an explicit name', t => {
	const result = normalizeTestCase({
		name: 'example',
		code: 'const foo = 1;',
	});

	t.is(result.name, 'example');
});


test('preserves output null', t => {
	t.is(
		normalizeTestCase({
			code: 'const foo = 1;',
			output: null,
		})
			.output,
		null,
	);
});


test('preserves filename and additional properties', t => {
	const result = normalizeTestCase({
		filename: 'README.md',
		code: '# Heading',
		options: ['example'],
	});

	t.is(result.filename, 'README.md');
	t.deepEqual(result.options, ['example']);
});
