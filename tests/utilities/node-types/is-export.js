import test from 'ava';

import {isExport} from '../../../source/utilities/node-types.js';
import utilityTester from '../../helpers/utility-tester.js';



function getResults(code) {
	return utilityTester({
		code,
		visitor: 'Program',
		run(_, node) {
			return isExport(node.body[0]);
		},
	});
}



test('recognizes export declarations', t => {
	t.true(
		getResults(`
			export default foo;
		`),
	);

	t.true(
		getResults(`
			export {default as foo} from 'foo';
		`),
	);
});


test('does not recognize other nodes as export declaration', t => {
	t.false(
		getResults(`
			import {foo} from 'foo';
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

	t.false(isExport(undefined));
});
