import eslintPlugin from 'eslint-plugin-eslint-plugin';

import amethyst from './source/index.js';



/**
 * @type {import('eslint').Linter.Config[]}
 */
const config = [
	...amethyst.configs.all,
	{
		files: [
			'source/rules/*.js',
		],
		...eslintPlugin.configs['rules-recommended'],
	},
	{
		files: [
			'tests/rules/*.js',
		],
		...eslintPlugin.configs['tests-recommended'],
	},
];



export default config;
