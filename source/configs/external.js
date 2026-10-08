const config = [
	{
		files: [
			'**/*.{js,jsx,mjs,cjs}',
		],
		rules: {
			'@stylistic/no-multiple-empty-lines': [
				'error',
				{
					max: 3,
				},
			],
			'@stylistic/object-curly-newline': [
				'error',
				{
					ImportDeclaration: 'never',
				},
			],
			'@stylistic/padding-line-between-statements': [
				'error',


				// Restore from XO.
				// -----------------------------------------------------------------------------
				{
					blankLine: 'always',
					prev: 'multiline-block-like',
					next: '*',
				},


				// Always pad before and after groups of consecutive variable declarations,
				// and between groups of different variable kinds.
				// -----------------------------------------------------------------------------
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

				// But ignore consecutive variables of the same kind.
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
				// -----------------------------------------------------------------------------
				{
					blankLine: 'always',
					prev: '*',
					next: [
						'return',
					],
				},
			],
			'import-x/order': [
				'error',
				{
					'newlines-between': 'always',
					alphabetize: {
						order: 'asc',
					},
					named: true,
				},
			],
			'jsdoc/require-asterisk-prefix': [
				'error',
				'always',
			],
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
