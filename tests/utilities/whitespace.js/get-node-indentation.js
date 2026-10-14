import test from 'ava';

import {getNodeIndentation} from '../../../source/utilities/whitespace.js';
import utilityTester from '../../helpers/utility-tester.js';



function getResults(code) {
	return utilityTester({
		code,
		visitor: 'Program',
		run(context, node) {
			return getNodeIndentation(
				context,
				node.body.find(({type}) => type === 'VariableDeclaration'),
			);
		},
		dedent: false,
	});
}



test('returns an empty string for no code', t => {
	t.is(getResults(''), '');
});


test('returns an empty string for unindented nodes', t => {
	t.is(getResults(''), '');
	t.is(getResults('const value = 1;'), '');
});


test('returns leading spaces', t => {
	t.is(getResults('    const value = 1;'), ' '.repeat(4));
});


test('returns leading tabs', t => {
	t.is(getResults('\t\tconst value = 1;'), '\t\t');
});


test('returns indentation for nodes inside a block', t => {
	const result = utilityTester({
		code: 'function example() {\n\t\tconst value = 1;\n}',
		visitor: 'Program',
		run(context, node) {
			return getNodeIndentation(context, node.body[0].body.body[0]);
		},
		dedent: false,
	});

	t.is(result, '\t\t');
});
