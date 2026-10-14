import test from 'ava';

import {emptyLinesBetween} from '../../../source/utilities/whitespace.js';
import utilityTester from '../../helpers/utility-tester.js';



function getResults(code) {
	return utilityTester({
		code,
		visitor: 'Program',
		run(_, node) {
			return emptyLinesBetween(node.body[0], node.body[1]);
		},
	});
}



function nodeAt(startLine, endLine = startLine) {
	return {
		loc: {
			start: {
				line: startLine,
			},
			end: {
				line: endLine,
			},
		},
	};
}



test('counts empty lines between nodes', t => {
	t.is(
		getResults(`
			const foo = 1;


			const bar = 2;
		`),
		2,
	);
});


test('returns zero when nodes are adjacent or on the same line', t => {
	t.is(
		getResults(`
			const foo = 1;
			const bar = 2;
		`),
		0,
	);

	t.is(
		getResults(`
			const foo = 1; const bar = 2;
		`),
		0,
	);
});


test('returns zero when node locations overlap or are reversed', t => {
	t.is(emptyLinesBetween(nodeAt(2, 5), nodeAt(4)), 0);
	t.is(emptyLinesBetween(nodeAt(5), nodeAt(4)), 0);
});
