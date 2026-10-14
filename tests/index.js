import test from 'ava';

import amethyst from '../source/index.js';



test('plugin metadata is exported', t => {
	t.is(amethyst.meta.name, 'eslint-plugin-amethyst');
	t.is(amethyst.meta.namespace, 'amethyst');
	t.truthy(amethyst.meta.version);
});


test('plugin exports its rules', t => {
	t.deepEqual(Object.keys(amethyst.rules), [
		'empty-lines',
	]);
});


test('plugin exports all configurations', t => {
	t.deepEqual(Object.keys(amethyst.configs), [
		'core',
		'compatibility',
		'external',
		'all',
	]);
});


test('core preset contains the Amethyst plugin and rules', t => {
	const [configuration] = amethyst.configs.core;

	t.is(configuration.name, 'amethyst/core');
	t.deepEqual(configuration.files, ['**/*.{js,jsx,mjs,cjs}']);
	t.is(configuration.plugins.amethyst, amethyst);
	t.deepEqual(configuration.rules, {
		'amethyst/empty-lines': 'error',
	});
});


test('core preset does not contain external rules', t => {
	const coreRules = Object.keys(amethyst.configs.core[0].rules);
	const externalRules = Object.keys(amethyst.configs.external[0].rules);

	for (const rule of externalRules) {
		t.false(coreRules.includes(rule));
	}
});


test('external preset contains its public configuration scopes', t => {
	t.deepEqual(amethyst.configs.external.map(configuration => configuration.name), [
		'amethyst/external',
		'amethyst/external/markdown',
		'amethyst/external/package-json',
	]);
});


test('external preset does not register the Amethyst plugin', t => {
	for (const configuration of amethyst.configs.external) {
		t.is(configuration.plugins?.amethyst, undefined);
	}
});


test('all preset contains the merged JavaScript and scoped configurations', t => {
	t.deepEqual(amethyst.configs.all.map(configuration => configuration.name), [
		'amethyst/all',
		'amethyst/all/markdown',
		'amethyst/all/package-json',
	]);

	t.deepEqual(amethyst.configs.all[0].files, ['**/*.{js,jsx,mjs,cjs}']);
	t.is(amethyst.configs.all[0].plugins.amethyst, amethyst);

	t.deepEqual(amethyst.configs.all[0].rules, {
		...amethyst.configs.external[0].rules,
		...amethyst.configs.compatibility[0].rules,
	});

	for (const scope of ['markdown', 'package-json']) {
		const allConfiguration = amethyst.configs.all.find(configuration => configuration.name.endsWith(`/${scope}`));
		const externalConfiguration = amethyst.configs.external.find(configuration => configuration.name.endsWith(`/${scope}`));
		const compatibilityConfiguration = amethyst.configs.compatibility.find(configuration => configuration.name.endsWith(`/${scope}`));

		t.deepEqual(allConfiguration, {
			...externalConfiguration,
			...compatibilityConfiguration,
			name: `amethyst/all/${scope}`,
		});
	}
});
