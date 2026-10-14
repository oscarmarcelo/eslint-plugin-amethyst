import test from 'ava';

import {isJSDoc} from '../../../source/utilities/node-types.js';
import utilityTester from '../../helpers/utility-tester.js';



function getResults(code) {
	return utilityTester({
		code,
		run(context) {
			return context.sourceCode
				.getAllComments()
				.map(comment => isJSDoc(comment));
		},
	});
}



function getNodeResults(code) {
	return utilityTester({
		code,
		visitor: 'Program',
		run(_, node) {
			return isJSDoc(node.body[0]);
		},
	});
}



test('recognizes JSDoc comments', t => {
	t.deepEqual(
		getResults(`
			/** JSDoc comment. */

			/**
			Multiline JSDoc comment
			*/

			/**
			 * Multiline JSDoc comment with prefix.
			 */
		`),
		[true, true, true],
	);
});


test('does not recognize non-JSDoc comments', t => {
	t.deepEqual(
		getResults(`
			// Line comment.

			/* Block comment. */

			/*
			Multiline block comment.
			*/

			/*
			 * Multiline block comment with prefix.
			 */
		`),
		[false, false, false, false],
	);
});


test('does not recognize missing comments', t => {
	t.deepEqual(
		getResults(`
			const foo = 1;
		`),
		[],
	);
});


test('does not recognize other nodes as JSDoc comments', t => {
	t.false(
		getNodeResults(`
			const foo = 1;
		`),
	);

	t.false(isJSDoc(undefined));
});
