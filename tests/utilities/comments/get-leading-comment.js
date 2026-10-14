import test from 'ava';

import {getLeadingComments} from '../../../source/utilities/comments.js';
import utilityTester from '../../helpers/utility-tester.js';



function getResults(code) {
	return utilityTester({
		code,
		visitor: 'Program',
		run(context, node) {
			return getLeadingComments(context, node.body.at(-1));
		},
	});
}



test('no comment', t => {
	t.is(
		getResults(`
			const foo = 1;
		`).length,
		0,
	);
});


test('single line comment', t => {
	t.is(
		getResults(`
			// Comment
			const foo = 1;
		`).length,
		1,
	);
});


test('single block comment', t => {
	t.is(
		getResults(`
			/* Comment */
			const foo = 1;
		`).length,
		1,
	);
});


test('single multiline block comment', t => {
	t.is(
		getResults(`
			/*
			Comment
			*/
			const foo = 1;
		`).length,
		1,
	);

	t.is(
		getResults(`
			/*
			 * Comment
			 */
			const foo = 1;
		`).length,
		1,
	);
});


test('multiple consecutive comments', t => {
	t.is(
		getResults(`
			// First
			// Second
			const foo = 1;
		`).length,
		2,
	);

	t.is(
		getResults(`
			/* First */
			/* Second */
			const foo = 1;
		`).length,
		1,
	);

	t.is(
		getResults(`
			/*
			First
			*/
			/*
			Second
			*/
			const foo = 1;
		`).length,
		1,
	);

	t.is(
		getResults(`
			/*
			 * First
			 */
			/*
			 * Second
			 */
			const foo = 1;
		`).length,
		1,
	);
});


test('mixed consecutive comments', t => {
	t.is(
		getResults(`
			/* First */
			// Second
			const foo = 1;
		`).length,
		1,
	);

	t.is(
		getResults(`
			/*
			First
			*/
			// Second
			const foo = 1;
		`).length,
		1,
	);

	t.is(
		getResults(`
			/*
			 *First
			 */
			// Second
			const foo = 1;
		`).length,
		1,
	);

	t.is(
		getResults(`
			// First
			/* Second */
			const foo = 1;
		`).length,
		1,
	);

	t.is(
		getResults(`
			// First
			/*
			Second
			*/
			const foo = 1;
		`).length,
		1,
	);
	t.is(
		getResults(`
			// First
			/*
			 * Second
			 */
			const foo = 1;
		`).length,
		1,
	);
});


test('empty line breaks attachments', t => {
	t.is(
		getResults(`
			// Not attached

			// Attached
			const foo = 1;
		`).length,
		1,
	);

	t.is(
		getResults(`
			// Not attached

			const foo = 1;
		`).length,
		0,
	);
});


test('inline comment isn\'t attached', t => {
	t.is(
		getResults(`
			const foo = 1; // Inline
		`).length,
		0,
	);

	t.is(
		getResults(`
			const foo = 1; /* Inline */
		`).length,
		0,
	);

	t.is(
		getResults(`
			const foo = 1; /*
			Inline
			*/
		`).length,
		0,
	);

	t.is(
		getResults(`
			const foo = 1; /*
			 * Inline
			 */
		`).length,
		0,
	);
});


test('inline comment breaks the group', t => {
	const comments1 = getResults(`
		// Attached
		const foo = 1; // Inline
	`);

	t.is(comments1.length, 1);
	t.like(
		comments1[0].loc,
		{
			start: {line: 1},
			end: {line: 1},
		},
	);

	const comments2 = getResults(`
		const foo = 1; // Inline
		// Attached
		const bar = 1;
	`);

	t.is(comments2.length, 1);
	t.like(
		comments2[0].loc,
		{
			start: {line: 2},
			end: {line: 2},
		},
	);
});


test('hashbang is excluded', t => {
	t.is(
		getResults(`
			#!/usr/bin/env node
			const foo = 1;
		`).length,
		0,
	);
});


test('ignores hashbang comments before an attached comment', t => {
	t.is(
		getResults(`
			#!/usr/bin/env node
			// Attached
			const foo = 1;
		`).length,
		1,
	);
});
