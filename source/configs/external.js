/**
 * Recommended settings for rules maintained by other ESLint plugins.
 * The referenced plugins are deliberately not registered or bundled here.
 *
 * @internal
 *
 * @type {(import('../create-config.js').ScopedConfig)[]}
 */
const config = [
	{
		files: [
			'**/*.{js,jsx,mjs,cjs}',
		],
		rules: {

			// Increase to up to three allowed empty lines.
			'@stylistic/no-multiple-empty-lines': [
				'error',
				{
					max: 3,
				},
			],

			// Keep named imports on one line.
			'@stylistic/object-curly-newline': [
				'error',
				{
					// Restored from XO.
					ObjectExpression: {
						multiline: true,
						minProperties: 4,
						consistent: true,
					},
					ObjectPattern: {
						multiline: true,
						consistent: true,
					},
					ExportDeclaration: {
						multiline: true,
						minProperties: 4,
						consistent: true,
					},

					// Configuration overrides.
					ImportDeclaration: 'never',
				},
			],

			// Require padding lines before and after statements.
			'@stylistic/padding-line-between-statements': [
				'error',

				// Restored from XO.
				{
					blankLine: 'always',
					prev: 'multiline-block-like',
					next: '*',
				},

				// Always pad before and after variable declarations...
				{
					blankLine: 'always',
					prev: '*',
					next: [
						'const',
						'let',
						'var',
					],
				},
				{
					blankLine: 'always',
					prev: [
						'const',
						'let',
						'var',
					],
					next: '*',
				},
				{
					blankLine: 'always',
					prev: [
						'const',
						'let',
						'var',
					],
					next: [
						'const',
						'let',
						'var',
					],
				},

				// ...while allowing variables of the same kind to group.
				{
					blankLine: 'any',
					prev: 'const',
					next: 'const',
				},
				{
					blankLine: 'any',
					prev: 'let',
					next: 'let',
				},
				{
					blankLine: 'any',
					prev: 'var',
					next: 'var',
				},

				// Always pad before returns
				{
					blankLine: 'always',
					prev: '*',
					next: [
						'return',
					],
				},
			],

			// Separate import groups and sort imported names consistently.
			'import-x/order': [
				'error',
				{
					// Restored from XO.
					'newlines-between': 'always',
					warnOnUnassignedImports: true,

					// Configuration overrides.
					alphabetize: {
						order: 'asc',
					},
					named: true,
				},
			],

			// Require the conventional asterisk prefix on every JSDoc line.
			'jsdoc/require-asterisk-prefix': [
				'error',
				'always',
			],

			// Sort JSDoc tags in a specific order, with each group separated by a single empty line.
			'jsdoc/sort-tags': [
				'error',
				{
					tagSequence: [
						{
							tags: [
								'internal',
								'private',
								'protected',
								'package',
								'access',
								'public',
							],
						},
						{
							tags: [
								'typedef',
								'callback',
							],
						},
						{
							tags: [
								'param',
								'arg',
								'argument',
							],
						},
						{
							tags: [
								'property',
								'prop',
							],
						},
						{
							tags: [
								'returns',
								'return',
							],
						},
						{
							tags: [
								'-other',
							],
						},
					],
				},
			],

			// Require an empty line after descriptions.
			'jsdoc/tag-lines': [
				'error',
				'any',
				{
					startLines: 1,
				},
			],

			// Keep warning/error output available while discouraging other console calls.
			'no-console': [
				'warn',
				{
					allow: [
						'warn',
						'error',
					],
				},
			],
		},
	},
	{
		files: [
			'**/*.md',
		],
		language: 'markdown/gfm',
		rules: {

			// Require headings to not skip level increments.
			'markdown/heading-increment': 'error',
		},
	},
	{
		scope: 'package-json',
		files: [
			'**/package.json',
		],
		language: 'json/json',
		rules: {

			// Sort package.json properties in a specific order.
			'package-json/sort-properties': [
				'error',
				{
					order: [
						// Package Information
						'name',
						'version',
						'description',
						'keywords',

						// Credits
						'author',
						'contributors',
						'maintainers',

						// Links
						'homepage',
						'repository',
						'bugs',
						'funding',

						// Access
						'license',
						'private',

						// Contents
						'type',
						'exports',
						'imports',
						'main',
						'module',
						'browser',
						'types',
						'typings',
						'bin',
						'man',
						'directories',
						'sideEffects',
						'files',
						'workspaces',

						// Environment
						'engines',
						'devEngines',
						'os',
						'cpu',

						// Usage
						'config',
						'scripts',

						// Dependencies
						'dependencies',
						'devDependencies',
						'peerDependencies',
						'peerDependenciesMeta',
						'optionalDependencies',
						'bundledDependencies',
						'overrides',

						// Package Management
						'publishConfig',
						'packageManager',
						'packageExtensions',
					],
				},
			],
		},
	},
];



export default config;
