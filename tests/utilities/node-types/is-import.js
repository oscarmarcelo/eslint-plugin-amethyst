import test from 'ava';

import {isImport} from '../../../source/utilities/node-types.js';
import utilityTester from '../../helpers/utility-tester.js';



function getResults(code) {
	return utilityTester({
		code,
		visitor: 'Program',
		run(_, node) {
			return isImport(node.body[0]);
		},
	});
}



test('recognizes import declarations', t => {
	t.true(
		getResults(`
			import foo from 'foo';
		`),
	);

	t.true(
		getResults(`
			import {foo} from 'foo';
		`),
	);
});


test('does not recognize other nodes as import declarations', t => {
	t.false(
		getResults(`
			export default foo;
		`),
	);

	t.false(
		getResults(`
			export {default as foo} from 'foo';
		`),
	);

	t.false(
		getResults(`
			const foo = 1;
		`),
	);

	t.false(
		getResults(`
			function foo () {}
		`),
	);

	t.false(isImport(undefined));
});
