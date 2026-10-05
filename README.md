# Amethyst

> Opinionated ESLint rules and configurations, designed to complement XO.



## Installation

Install Amethyst as a development dependency:

```sh
npm install --save-dev eslint-plugin-amethyst
```

Requires [ESLint](https://eslint.org) `>=10` or [XO](https://github.com/xojs/xo).



## Usage

Amethyst uses ESLint's flat configuration format and can be used directly with ESLint or as part of an XO configuration.

```js
import amethyst from 'eslint-plugin-amethyst';

export default [
	...amethyst.configs.all,
];
```

> [!NOTE]
> The `compatibility`, `external`, and `all` presets configure rules provided by other ESLint plugins, but Amethyst does **not** bundle those plugins.
>
> This keeps Amethyst lightweight and allows it to work naturally with configurations such as XO, which already provides many of these plugins.



## Presets

Amethyst provides several presets that combine its different groups of rules and configurations.

| Preset | [Core rules](#core-rules) | [Compatibility rules](#compatibility-rules) | [External rules](#external-rules) |
| --- | --- | --- | --- |
| `core` | ✅ | ❌ | ❌ |
| `compatibility` | ✅ | ✅ | ❌ |
| `external` | ❌ | ❌ | ✅ |
| `all` | ✅ | ✅ | ✅ |


### `core`

The `core` preset contains only rules implemented and maintained directly by Amethyst.

> [!NOTE]
> This preset is currently empty. Amethyst's core rules will be added in future releases.


### `compatibility`

The `compatibility` preset contains Amethyst's core rules together with configuration changes intended to make them work well with other ESLint configurations and plugins, including XO.

> [!NOTE]
> This preset is currently equivalent to `core`, as neither Amethyst rules nor compatibility changes have been added yet.


### `external`

The `external` preset contains configurations for rules provided by other ESLint plugins that Amethyst recommends.


### `all`

The `all` preset combines all three groups:

1. Amethyst's core rules.
2. Compatibility adjustments for other ESLint configurations and plugins.
3. Recommended rules provided by external ESLint plugins.

> [!TIP]
> This is the recommended preset when you want the complete Amethyst configuration.



## Rules

Amethyst's rules and configurations are divided into three groups.


### Core rules

These are rules implemented and maintained directly by Amethyst.

> [!NOTE]
> They are not available yet. Core rules will be introduced in future releases.


### Compatibility rules

These are configuration changes that prevent conflicts between Amethyst and other ESLint configurations or plugins.

They may, for example, disable or adjust an external rule when it conflicts with an Amethyst rule.

> [!NOTE]
> They are not available yet. Compatibility rules will be introduced in future releases.


### External rules

Amethyst also provides configurations for rules maintained by other ESLint plugins.

| Rule | Level | Description |
| --- | --- | --- |
| `@stylistic/no-multiple-empty-lines` | Error | Allows up to 3 consecutive empty lines. |
| `@stylistic/object-curly-newline` | Error | Does not report named imports. |
| `import-x/order` | Error | Enforces empty lines between import groups and alphabetical ordering of imports, including named imports. |
| `jsdoc/require-asterisk-prefix` | Error | Enforces each JSDoc line to start with `*`. |
| `no-console` | Warn | Reports the use of `console`, except for `.warn()` and `.error()`. |
| `markdown/heading-increment` | Error | Enforces correct use of heading levels. |
| `package-json/sort-properties` | Error | Enforces a custom property order. |



## Why Amethyst?

Amethyst provides additional opinionated ESLint rules and configurations for projects that want greater consistency than ESLint and XO provide by default.

The project is named after the combination of:

* The use of purple and hexagons in ESLint's branding.
* The six-sided shape of an amethyst crystal.
* A focus on stylistic and consistency-oriented rules.
