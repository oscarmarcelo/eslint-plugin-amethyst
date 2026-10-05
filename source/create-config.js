function getScope(configuration) {
	return configuration.scope
		|| (
			configuration.language && configuration.language !== '*'
				? configuration.language.split('/', 1)[0]
				: undefined
		);
}



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



function canMergeConfigurations(first, second) {
	return getScope(first) === getScope(second)
		&& first.language === second.language
		&& areArraysEqual(first.files, second.files);
}



function mergeConfiguration(first, second) {
	const configuration = {
		...first,
		...second,
		...(
			(
				first.plugins
				|| second.plugins
			)
			&& {
				plugins: {
					...first.plugins,
					...second.plugins,
				},
			}
		),
		...(
			(
				first.rules
				|| second.rules
			)
			&& {
				rules: {
					...first.rules,
					...second.rules,
				},
			}
		),
	};



	return configuration;
}



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



export function mergeConfigurations(...configurations) {
	const merged = [];

	for (const configuration of configurations.flat()) {
		const index = merged.findIndex(existing => canMergeConfigurations(existing, configuration));

		if (index === -1) {
			merged.push({...configuration});

			continue;
		}

		merged[index] = mergeConfiguration(merged[index], configuration);
	}

	return merged;
}
