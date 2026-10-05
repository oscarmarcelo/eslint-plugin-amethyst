import outdent from 'outdent';



export default function normalizeTestCase(testCase) {
	if (typeof testCase === 'string') {
		testCase = {code: testCase};
	}

	const code = testCase.code && outdent.string(testCase.code);

	return {
		...testCase,
		...(!testCase.name && {name: code}),
		...(code && {code}),
		...(
			Object.hasOwn(testCase, 'output')
			&& {
				output: testCase.output === null
					? null
					: outdent.string(testCase.output),
			}
		),
	};
}
