import test from 'ava';

import {isInlineComment} from '../../../source/utilities/comments.js';
import utilityTester from '../../helpers/utility-tester.js';



function getResults(code) {
	return utilityTester({
		code,
		run(context) {
			return context.sourceCode
				.getAllComments()
				.map(comment => isInlineComment(context, comment));
		},
	});
}



test('inline line comment', t => {
	t.deepEqual(
		getResults(`
			const foo = 1; // Comment
		`),
		[true],
	);
});

test('inline block comment', t => {
	t.deepEqual(
		getResults(`
			const foo = 1; /* Comment */
		`),
		[true],
	);
});

test('inline multiline block comment', t => {
	t.deepEqual(
		getResults(`
			const foo = 1 /*
			Inline
			*/;
		`),
		[true],
	);

	t.deepEqual(
		getResults(`
			const foo = 1 /*
			 * Inline
			 */;
		`),
		[true],
	);
});


test('line comment above', t => {
	t.deepEqual(
		getResults(`
			// Comment
			const foo = 1;
		`),
		[false],
	);
});


test('block comment above', t => {
	t.deepEqual(
		getResults(`
			/* Comment */
			const foo = 1;
		`),
		[false],
	);

	t.deepEqual(
		getResults(`
			/*
			Comment
			*/
			const foo = 1;
		`),
		[false],
	);

	t.deepEqual(
		getResults(`
			/*
			 * Comment
			 */
			const foo = 1;
		`),
		[false],
	);
});


test('line comment below', t => {
	t.deepEqual(
		getResults(`
			const foo = 1;
			// Comment
		`),
		[false],
	);
});


test('block comment below', t => {
	t.deepEqual(
		getResults(`
			const foo = 1;
			/* Comment */
		`),
		[false],
	);

	t.deepEqual(
		getResults(`
			const foo = 1;
			/*
			Comment
			*/
		`),
		[false],
	);

	t.deepEqual(
		getResults(`
			const foo = 1;
			/*
			 * Comment
			 */
		`),
		[false],
	);
});


test('block comment between lines of code', t => {
	t.deepEqual(
		getResults(`
			const foo = 1;
			/* Comment */
			const bar = 2;
		`),
		[false],
	);
});


test('mixed comments', t => {
	t.deepEqual(
		getResults(`
			const foo = 1; /* Inline */
			// Attached
			const bar = 2;
			/* Attached */
			const baz = 3; // Inline
		`),
		[true, false, false, true],
	);
});
