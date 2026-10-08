import test from 'ava';

import external from '../../../source/configs/external.js';



test('configures package.json rules for package-json', t => {
	const configuration = external.find(configuration => configuration.scope === 'package-json');

	t.truthy(configuration);
	t.deepEqual(configuration.files, ['**/package.json']);
	t.is(configuration.language, 'json/json');
});
