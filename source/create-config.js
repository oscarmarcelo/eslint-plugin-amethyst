/**
 * @import {Linter} from 'eslint';
 */



/**
 * An ESLint flat configuration with an internal scope used to group presets.
 *
 * @typedef {Linter.Config & {scope?: string}} ScopedConfig
 */



/**
 * Determine the scope used when naming or comparing configurations.
 * An explicit scope takes precedence over the first segment of the language name.
 *
 * @internal
 *
 * @param {ScopedConfig} configuration - The configuration to inspect.
 *
 * @returns {string | undefined} The configuration scope, if one can be inferred.
 */
function getScope(configuration) {
	return configuration.scope
		|| (
			configuration.language && configuration.language !== '*'
				? configuration.language.split('/', 1)[0]
				: undefined
		);
}



/**
 * Compare two arrays by identity of their corresponding values.
 *
 * @internal
 *
 * @param {unknown} first - The first value to compare.
 * @param {unknown} second - The second value to compare.
 *
 * @returns {boolean} Whether both values are equal arrays or the same value.
 */
function areArraysEqual(first, second) {
	if (first === second) {
		return true;
	}

	if (!Array.isArray(first) || !Array.isArray(second)) {
		return false;
	}

	return first.length === second.length
		&& first.every((value, index) => value === second[index]);
}



/**
 * Check whether two configurations target the same files, language, and scope.
 *
 * @internal
 *
 * @param {ScopedConfig} first - The first configuration.
 * @param {ScopedConfig} second - The second configuration.
 *
 * @returns {boolean} Whether the configurations can be merged.
 */
function canMergeConfigurations(first, second) {
	return getScope(first) === getScope(second)
		&& first.language === second.language
		&& areArraysEqual(first.files, second.files);
}



/**
 * Create configurations, by adding stable names and removing the internal `scope` property.
 *
 * @internal
 *
 * @param {string} namespace - The plugin namespace.
 * @param {string} name - The preset name.
 * @param {ScopedConfig[]} configurations - The configurations to name.
 *
 * @returns {Linter.Config[]} The named ESLint configurations.
 */
export function createConfigurations(namespace, name, configurations) {
	return configurations.map(configuration => {
		const config = {...configuration};

		delete config.scope;

		return {
			name: [
				namespace,
				name,
				getScope(configuration),
			]
				.filter(Boolean)
				.join('/'),
			...config,
		};
	});
}



/**
 * Merge configurations with matching scope, language, and file patterns.
 * Configuration order is preserved, and later matching entries take precedence.
 *
 * @internal
 *
 * @param {...(ScopedConfig | ScopedConfig[])[]} configurations - Configuration arrays or individual configurations.
 *
 * @returns {ScopedConfig[]} The merged configurations.
 */
export function mergeConfigurations(...configurations) {
	const merged = [];

	// Flatten preset groups so callers can pass either individual configurations
	// or arrays of configurations without handling the shape themselves.
	for (const configuration of configurations.flat()) {
		const index = merged.findIndex(existing => canMergeConfigurations(existing, configuration));

		if (index === -1) {
			merged.push({...configuration});

			continue;
		}

		merged[index] = {
			...merged[index],
			...configuration,
			...(
				(
					merged[index].plugins
					|| configuration.plugins
				)
				&& {
					plugins: {
						...merged[index].plugins,
						...configuration.plugins,
					},
				}
			),
			...(
				(
					merged[index].rules
					|| configuration.rules
				)
				&& {
					rules: {
						...merged[index].rules,
						...configuration.rules,
					},
				}
			),
		};
	}

	return merged;
}
