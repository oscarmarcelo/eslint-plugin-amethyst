import test from 'ava';

import {isJSDocImport} from '../../../source/utilities/node-types.js';
import utilityTester from '../../helpers/utility-tester.js';



function getResults(code) {
	return utilityTester({
		code,
		run(context) {
			return context.sourceCode
				.getAllComments()
				.map(comment => isJSDocImport(comment));
		},
	});
}



function getNodeResults(code) {
	return utilityTester({
		code,
		visitor: 'Program',
		run(_, node) {
			return isJSDocImport(node.body[0]);
		},
	});
}



test('recognizes JSDoc @import syntax', t => {
	t.deepEqual(
		getResults(`
			/** @import Foo from 'foo'; */

			/**
			 * @import {Foo} from 'foo';
			 */

			/**
			 * @import {Foo as Bar} from 'foo';
			 * @import {Baz} from 'baz';
			 */


			/**
			 * A description.
			 *
			 * @import {Foo} from 'foo';
			 */

			/**
			 * @import {
			 *   Foo,
			 *   Bar as Baz
			 * } from 'foo';
			 */

			/**
			 * @import {
			 *   Foo
			 * } from 'foo';
			 * @import {
			 *   Bar
			 * } from 'bar';
			 */
		`),
		[true, true, true, true, true, true],
	);
});


test('recognizes JSDoc @typedef tags that import a type', t => {
	t.deepEqual(
		getResults(`
			/** @typedef {import('foo').Foo} Foo */

			/** @typedef {import("foo").Foo} Foo */

			/**
			 * A description.
			 *
			 * @typedef {import('foo').Foo} Foo
			 */

			/**
			 * @typedef {
			 *   import('foo').Foo
			 * } Foo
			 */

			/**
			 * @typedef {
			 *   import(
			 *     'foo'
			 *   ).Foo
			 * } Foo
			 */
		`),
		[true, true, true, true, true],
	);
});


test('recognizes JSDoc with both @import and @typedef tags', t => {
	t.deepEqual(
		getResults(`
			/**
			 * @import {Foo} from 'foo';
			 *
			 * @typedef {import('bar').Bar} Bar
			 */

			/**
			 * @import {
			 *   Foo
			 * } from 'foo';
			 *
			 * @typedef {
			 *   import('bar').Bar
			 * } Bar
			 */
		`),
		[true, true],
	);
});



test('does not recognize ordinary JSDoc comments as import comments', t => {
	t.deepEqual(
		getResults(`
			/** */

			/** A description. */

			/** @typedef {Object} Foo */

			/** @typedef {Object} Foo - See import('foo').Foo for details. */
		`),
		[false, false, false, false],
	);
});


test('does not recognize non-JSDoc comments as import comments', t => {
	t.deepEqual(
		getResults(`
			/*
			@import {Foo} from 'foo';
			*/
		`),
		[false],
	);
});


test('does not recognize other nodes as JSDoc comments', t => {
	t.false(
		getNodeResults(`
			const foo = 1;
		`),
	);

	t.false(isJSDocImport(undefined));
});
