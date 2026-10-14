import test from 'ava';

import {isMethod} from '../../../source/utilities/node-types.js';
import utilityTester from '../../helpers/utility-tester.js';



function getResults(code) {
	return utilityTester({
		code,
		visitor: 'ClassBody',
		run(_, node) {
			return isMethod(node.body[0]);
		},
	});
}



test('recognizes method definitions', t => {
	t.true(
		getResults(`
			class Foo {
				bar() {}
			}
		`),
	);
});


test('does not recognize other node types as methods', t => {
	t.false(
		getResults(`
			class Foo {
				bar;
			}
		`),
	);

	t.false(
		utilityTester({
			code: `
				function foo() {
					function bar() {}
				}
			`,
			visitor: 'FunctionDeclaration',
			run(_, node) {
				return isMethod(node.body[0]);
			},
		}),
	);

	t.false(
		utilityTester({
			code: `
				const foo = function () {}
			`,
			visitor: 'VariableDeclarator',
			run(_, node) {
				return isMethod(node.init);
			},
		}),
	);

	t.false(isMethod(undefined));
});
