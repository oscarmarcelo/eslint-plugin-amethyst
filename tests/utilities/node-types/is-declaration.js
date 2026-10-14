import test from 'ava';

import {isDeclaration} from '../../../source/utilities/node-types.js';
import utilityTester from '../../helpers/utility-tester.js';



function getResults(code) {
	return utilityTester({
		code,
		visitor: 'Program',
		run(_, node) {
			return isDeclaration(node.body[0]);
		},
	});
}



test('recognizes class and function declarations', t => {
	t.true(
		getResults(`
			class Foo {}
		`),
	);

	t.true(
		getResults(`
			function foo() {}
		`),
	);
});


test('does not recognize other nodes as class or function declarations', t => {
	t.false(
		getResults(`
			const foo = class {}
		`),
	);

	t.false(
		getResults(`
			const foo = function () {}
		`),
	);

	t.false(
		getResults(`
			const foo = 1;
		`),
	);

	t.false(isDeclaration(undefined));
});
