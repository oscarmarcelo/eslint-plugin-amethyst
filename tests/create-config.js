import test from 'ava';

import {createConfigurations, mergeConfigurations} from '../source/create-config.js';



test('createConfigurations creates named configurations', t => {
	const configurations = createConfigurations('amethyst', 'external', [
		{
			rules: {
				'no-console': 'error',
			},
		},
		{
			files: ['**/*.md'],
			language: 'markdown/*',
			rules: {
				'no-warning-comments': 'error',
			},
		},
		{
			scope: 'package-json',
			files: ['**/package.json'],
			language: 'json/json',
			rules: {
				'no-warning-comments': 'error',
			},
		},
	]);

	t.deepEqual(configurations, [
		{
			name: 'amethyst/external',
			rules: {
				'no-console': 'error',
			},
		},
		{
			name: 'amethyst/external/markdown',
			files: ['**/*.md'],
			language: 'markdown/*',
			rules: {
				'no-warning-comments': 'error',
			},
		},
		{
			name: 'amethyst/external/package-json',
			files: ['**/package.json'],
			language: 'json/json',
			rules: {
				'no-warning-comments': 'error',
			},
		},
	]);
});


test('createConfigurations does not include scope in the ESLint configuration', t => {
	const [configuration] = createConfigurations('amethyst', 'external', [
		{
			scope: 'package-json',
		},
	]);

	t.false('scope' in configuration);
});


test('createConfigurations uses the first language segment as the scope', t => {
	const [configuration] = createConfigurations('amethyst', 'external', [
		{
			language: 'markdown/*',
		},
	]);

	t.is(configuration.name, 'amethyst/external/markdown');
});


test('createConfigurations does not add a scope for catch-all configurations', t => {
	const [configuration] = createConfigurations('amethyst', 'external', [
		{},
	]);

	t.is(configuration.name, 'amethyst/external');
});


test('createConfigurations prefers an explicit scope over the language scope', t => {
	const [configuration] = createConfigurations('amethyst', 'external', [
		{
			scope: 'custom',
			language: 'markdown/*',
		},
	]);

	t.is(configuration.name, 'amethyst/external/custom');
});


test('mergeConfigurations merges matching configurations', t => {
	const result = mergeConfigurations(
		{
			language: 'javascript',
			files: ['**/*.js'],
			rules: {
				'no-console': 'error',
				'no-alert': 'warn',
			},
			plugins: {
				first: {},
			},
		},
		{
			language: 'javascript',
			files: ['**/*.js'],
			rules: {
				'no-console': 'off',
				'no-debugger': 'error',
			},
			plugins: {
				second: {},
			},
		},
	);

	t.deepEqual(result, [
		{
			language: 'javascript',
			files: ['**/*.js'],
			rules: {
				'no-console': 'off',
				'no-alert': 'warn',
				'no-debugger': 'error',
			},
			plugins: {
				first: {},
				second: {},
			},
		},
	]);
});


test('mergeConfigurations lets later configurations override earlier rules', t => {
	const result = mergeConfigurations(
		{
			rules: {
				'no-console': 'error',
			},
		},
		{
			rules: {
				'no-console': 'off',
			},
		},
	);

	t.deepEqual(result, [
		{
			rules: {
				'no-console': 'off',
			},
		},
	]);
});


test('mergeConfigurations keeps configurations with different scopes separate', t => {
	const result = mergeConfigurations(
		{
			scope: 'javascript',
			language: 'javascript',
		},
		{
			scope: 'markdown',
			language: 'markdown/*',
		},
	);

	t.deepEqual(result, [
		{
			scope: 'javascript',
			language: 'javascript',
		},
		{
			scope: 'markdown',
			language: 'markdown/*',
		},
	]);
});


test('mergeConfigurations keeps configurations with different languages separate', t => {
	const result = mergeConfigurations(
		{
			scope: 'javascript',
			language: 'javascript',
		},
		{
			scope: 'javascript',
			language: 'javascript/*',
		},
	);

	t.deepEqual(result, [
		{
			scope: 'javascript',
			language: 'javascript',
		},
		{
			scope: 'javascript',
			language: 'javascript/*',
		},
	]);
});


test('mergeConfigurations keeps configurations with different files separate', t => {
	const result = mergeConfigurations(
		{
			language: 'javascript',
			files: ['**/*.js'],
		},
		{
			language: 'javascript',
			files: ['**/*.mjs'],
		},
	);

	t.deepEqual(result, [
		{
			language: 'javascript',
			files: ['**/*.js'],
		},
		{
			language: 'javascript',
			files: ['**/*.mjs'],
		},
	]);
});


test('mergeConfigurations keeps configurations with non-array files separate', t => {
	const result = mergeConfigurations(
		{
			language: 'javascript',
			files: ['**/*.js'],
		},
		{
			language: 'javascript',
			files: '**/*.js',
		},
	);

	t.deepEqual(result, [
		{
			language: 'javascript',
			files: ['**/*.js'],
		},
		{
			language: 'javascript',
			files: '**/*.js',
		},
	]);
});


test('mergeConfigurations treats missing language and files as matching', t => {
	const result = mergeConfigurations(
		{
			rules: {
				'no-console': 'error',
			},
		},
		{
			rules: {
				'no-debugger': 'error',
			},
		},
	);

	t.deepEqual(result, [
		{
			rules: {
				'no-console': 'error',
				'no-debugger': 'error',
			},
		},
	]);
});


test('mergeConfigurations considers an explicit scope equivalent to its inferred scope', t => {
	const result = mergeConfigurations(
		{
			language: 'markdown/*',
			files: ['**/*.md'],
			rules: {
				'no-console': 'error',
				'no-debugger': 'error',
			},
		},
		{
			scope: 'markdown',
			language: 'markdown/*',
			files: ['**/*.md'],
			rules: {
				'no-console': 'off',
			},
		},
	);

	t.deepEqual(result, [
		{
			scope: 'markdown',
			language: 'markdown/*',
			files: ['**/*.md'],
			rules: {
				'no-console': 'off',
				'no-debugger': 'error',
			},
		},
	]);
});


test('mergeConfigurations lets later plugins override earlier plugins', t => {
	const first = {};
	const second = {};

	const result = mergeConfigurations(
		{plugins: {example: first}},
		{plugins: {example: second}},
	);

	t.is(result[0].plugins.example, second);
});


test('mergeConfigurations gives later configurations precedence', t => {
	const result = mergeConfigurations(
		{
			scope: 'javascript',
			language: 'javascript',
			files: ['**/*.js'],
			rules: {
				'no-console': 'error',
			},
		},
		{
			scope: 'javascript',
			language: 'javascript',
			files: ['**/*.js'],
			rules: {
				'no-console': 'off',
			},
		},
	);

	t.deepEqual(result, [
		{
			scope: 'javascript',
			language: 'javascript',
			files: ['**/*.js'],
			rules: {
				'no-console': 'off',
			},
		},
	]);
});
