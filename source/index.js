import packageJson from '../package.json' with {type: 'json'};

import * as rules from './configs/amethyst.js';
import compatibilityConfig from './configs/compatibility.js';
import externalConfig from './configs/external.js';
import {createConfigurations, mergeConfigurations} from './create-config.js';



const namespace = packageJson.name.replace(/^eslint-plugin-/v, '');

const amethyst = {
	meta: {
		name: packageJson.name,
		namespace,
		version: packageJson.version,
	},
	rules,
	configs: {},
};

const coreConfig = [
	{
		files: [
			'**/*.{js,jsx,mjs,cjs}',
		],
		plugins: {
			[namespace]: amethyst,
		},
		rules: Object.fromEntries(
			Object.keys(rules)
				.map(rule => [
					`${namespace}/${rule}`,
					'error',
				]),
		),
	},
];

const configurations = {
	core: coreConfig,
	compatibility: mergeConfigurations(coreConfig, compatibilityConfig),
	external: externalConfig,
	all: mergeConfigurations(coreConfig, compatibilityConfig, externalConfig),
};

for (const [name, configs] of Object.entries(configurations)) {
	amethyst.configs[name] = createConfigurations(namespace, name, configs);
}



export default amethyst;
