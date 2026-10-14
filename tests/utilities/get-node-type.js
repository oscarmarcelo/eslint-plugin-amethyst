import test from 'ava';

import getNodeType from '../../source/utilities/get-node-type.js';
import utilityTester from '../helpers/utility-tester.js';



function getResults(code) {
	return utilityTester({
		code,
		visitor: 'Program',
		run(_, node) {
			return getNodeType(node.body[0]);
		},
	});
}



test('converts node types to readable strings', t => {
	t.is(
		getResults('const foo = 1;'),
		'variable declaration',
	);

	t.is(
		getResults('import foo from \'foo\';'),
		'import declaration',
	);

	t.is(
		getResults('if(true) {}'),
		'if statement',
	);
});


test('uses a readable name for export declarations', t => {
	t.is(
		getResults('export default foo;'),
		'export declaration',
	);

	t.is(
		getResults('export {default as foo} from \'foo\';'),
		'export declaration',
	);
});
