/**
 * @type {import('eslint-doc-generator').GenerateOptions}
 */
const config = {
	configEmoji: [
		['core', '🟣'],
		['compatibility', '🛠️'],
		['external', '☀️'],
		['all', '🌐'],
	],
	ruleListColumns: [
		'name',
		'description',
		'fixable',
		'hasSuggestions',
		'requiresTypeChecking',
		'deprecated',
	],
};



export default config;
