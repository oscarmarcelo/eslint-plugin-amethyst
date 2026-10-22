import {detectNewline} from 'detect-newline';

import {getLeadingComments, isInlineComment} from '../utilities/comments.js';
import getNodeType from '../utilities/get-node-type.js';
import {isDeclaration, isExport, isImport, isJSDoc, isJSDocImport, isMethod} from '../utilities/node-types.js';
import {emptyLinesBetween, getNodeIndentation} from '../utilities/whitespace.js';

/**
 * @import {Rule} from 'eslint';
 * @import {Node, Comment, Position} from 'estree';
 */



/**
 * A code unit, which groups an AST node with its leading comments and complete source span.
 *
 * @internal
 *
 * @typedef {object} Unit
 *
 * @property {Node | Comment} node - The AST node or standalone comment represented by the unit.
 * @property {Comment[]} leadingComments - The leading comments attached to the node.
 * @property {[number, number]} range - The source character offsets at which the unit starts and ends.
 * @property {{start: Position, end: Position}} loc - The source location spanning the unit and its attached comments.
 */



/**
 * A spacing value, which can be fixed or calculated from the current and adjacent units.
 * Returning a non-integer skips the corresponding check.
 *
 * @internal
 *
 * @typedef {number | ((current: Unit, adjacent: Unit) => number | undefined)} SpacingValue
 */



/**
 * The required amount of empty lines for each kind of code unit.
 *
 * @internal
 */
const EMPTY_LINES = {
	docImport: 1,
	declaration: 3,
	nestedMember: 2,
};



/**
 * Create an array of code units in a given scope.
 *
 * @internal
 *
 * @param {Rule.RuleContext} context - The rule's context.
 * @param {Node & {body: Node[]}} scope - The scope whose direct body is inspected.
 *
 * @returns {Unit[]} The code units in source order.
 */
function createUnits(context, scope) {
	const units = [];
	const comments = new Set();

	// Only include comments belonging to this scope, excluding comments already
	// inside a direct child node; those are handled with that child instead.
	const scopeComments = context.sourceCode
		.getAllComments()
		.filter(comment =>
			comment.range[0] >= scope.range[0]
			&& comment.range[1] <= scope.range[1]
			&& scope.body.every(node =>
				!(
					comment.range[0] >= node.range[0]
					&& comment.range[1] <= node.range[1]
				),
			),
		);

	for (const node of scope.body) {
		const leadingComments = getLeadingComments(context, node);

		for (const comment of leadingComments) {
			comments.add(comment);
		}

		// Inline comments in the last line must be preserved.
		const nextComments = scopeComments.filter(comment => comment.range[0] >= node.range[1]);

		const trailingComments = [];

		for (const comment of nextComments) {
			const previous = trailingComments.at(-1) ?? node;

			if (comment.loc.start.line !== previous.loc.end.line) {
				break; // eslint-disable-line unicorn/no-break-in-nested-loop
			}

			trailingComments.push(comment);
		}

		units.push({
			node,
			leadingComments,
			range: [
				leadingComments[0]?.range[0] ?? node.range[0],
				trailingComments.at(-1)?.range[1] ?? node.range[1],
			],
			loc: {
				start: leadingComments[0]?.loc.start ?? node.loc.start,
				end: trailingComments.at(-1)?.loc.end ?? node.loc.end,
			},
		});
	}

	for (const comment of scopeComments) {
		if (!isInlineComment(context, comment) && !comments.has(comment)) {
			units.push({
				node: comment,
				leadingComments: [],
				range: comment.range,
				loc: comment.loc,
			});
		}
	}

	return units.toSorted((a, b) => a.range[0] - b.range[0]);
}



/**
 * Require an amount of empty lines before and after a code unit.
 *
 * @internal
 *
 * @param {object} options - The spacing options.
 * @param {Rule.RuleContext} options.context - The ESLint rule context.
 * @param {Unit[]} options.units - The ordered units to check.
 * @param {SpacingValue} [options.adjacent] - Spacing applied before and after each unit.
 * @param {SpacingValue} [options.before] - Spacing before each unit. Defaults to `adjacent`.
 * @param {SpacingValue} [options.after] - Spacing after each unit. Defaults to `adjacent`.
 */
function requireEmptyLines({context, units, adjacent, before, after}) {
	before ??= adjacent;
	after ??= adjacent;

	for (const [index, unit] of units.entries()) {
		if ((before || before === 0) && index > 0) {
			const beforeUnit = units[index - 1];

			const expected = typeof before === 'function'
				? before(unit, beforeUnit)
				: before;

			if (Number.isSafeInteger(expected)) {
				reportEmptyLines({
					context,
					beforeUnit,
					afterUnit: unit,
					position: 'before',
					expected,
				});
			}
		}

		// eslint-disable-next-line unicorn/prefer-continue
		if ((after || after === 0) && index < units.length - 1) {
			const afterUnit = units[index + 1];

			const expected = typeof after === 'function'
				? after(unit, afterUnit)
				: after;

			if (Number.isSafeInteger(expected)) {
				reportEmptyLines({
					context,
					beforeUnit: unit,
					afterUnit,
					position: 'after',
					expected,
				});
			}
		}
	}
}



/**
 * Report empty lines between two code units when their spacing is incorrect.
 *
 * @internal
 *
 * @param {object} options - The reporting options.
 * @param {Rule.RuleContext} options.context - The ESLint rule context.
 * @param {Unit} options.beforeUnit - The unit before the empty lines being checked.
 * @param {Unit} options.afterUnit - The unit after the empty lines being checked.
 * @param {'before' | 'after'} options.position - Which side of the spacing triggered the report.
 * @param {number} options.expected - The expected amount of empty lines.
 */
function reportEmptyLines({context, beforeUnit, afterUnit, position, expected}) {
	if (!Number.isSafeInteger(expected) || expected < 0) {
		expected = 0;
	}

	const count = emptyLinesBetween(beforeUnit, afterUnit);

	if (count === expected) {
		return;
	}

	// Intentionally inverted, because the reported node should be the one requiring it.
	const node = position === 'before'
		? afterUnit.node
		: beforeUnit.node;

	context.report({
		node,
		messageId: `require-empty-lines-${position}`,
		data: {
			expected,
			lines: `line${expected === 1 ? '' : 's'}`,
			type: getNodeType(node),
			count,
		},
		fix(fixer) {
			const newline = detectNewline(context.sourceCode.text) ?? '\n';

			// Preserve leading whitespace of `afterUnit.node` if it doesn't start in the same line as `beforeUnit` ends.
			// Otherwise, use `beforeUnit.node` indentation instead, stripping any whitespace between them.
			const leadingWhitespace = context.sourceCode
				.lines[afterUnit.node.loc.start.line - 1]
				.slice(0, afterUnit.node.loc.start.column);

			const indentation = /^[\t ]*$/v.test(leadingWhitespace)
				? leadingWhitespace
				: getNodeIndentation(context, beforeUnit.node);

			return fixer.replaceTextRange(
				[
					beforeUnit.range[1],
					afterUnit.range[0],
				],
				newline.repeat(expected + 1) + indentation,
			);
		},
	});
}



/**
 * Check whether a code unit has leading JSDoc comments attached.
 *
 * @internal
 *
 * @param {Unit} unit - The unit to check.
 *
 * @returns {boolean} Whether the unit has JSDoc comments.
 */
function hasJSDoc(unit) {
	return unit.leadingComments.some(comment => isJSDoc(comment));
}



/**
 * Check whether a code unit is an export declaration with one of the following conditions:
 * - passed adjacent unit isn't an export declaration;
 * - the unit is exporting a class or function declaration.
 *
 * @internal
 *
 * @param {Unit} currentUnit - The unit to check.
 * @param {Unit} adjacentUnit - The adjacent unit to check.
 *
 * @returns {boolean} Whether the unit is an export declaration meeting those conditions.
 */
function isLoneOrDeclarationExport(currentUnit, adjacentUnit) {
	return (
		isExport(currentUnit.node)
		&& (
			!isExport(adjacentUnit.node)
			|| isDeclaration(currentUnit.node?.declaration)
		)
	);
}



/**
 * Create the listeners used by the rule.
 *
 * @internal
 *
 * @param {Rule.RuleContext} context - The rule's context.
 *
 * @returns {Rule.RuleListener} The rule's visitors.
 */
function create(context) {
	/**
	 * Apply spacing rules to nested members.
	 *
	 * @internal
	 *
	 * @param {Node} node - The node to visit.
	 */
	function nestedDeclaration(node) {
		requireEmptyLines({
			context,
			units: createUnits(context, node.body),
			adjacent(current) {
				// One of following:
				// - Class and function declarations
				// - Standalone JSDoc comments
				// - Units with JSDoc comments
				if (
					isDeclaration(current.node)
					|| isJSDoc(current.node)
					|| hasJSDoc(current)
				) {
					return EMPTY_LINES.nestedMember;
				}
			},
		});
	}


	return {
		Program(node) {
			const units = createUnits(context, node);

			const lastImport = units.findLast(unit => isImport(unit.node));

			requireEmptyLines({
				context,
				units,
				before(current, previous) {
					// One of following:
					// - Class and function declarations
					// - Units with JSDoc comments
					// - Export declarations if:
					//   - the previous unit isn't an export declaration
					//   - it's an exported class or function declaration
					if (
						isDeclaration(current.node)
						|| hasJSDoc(current)
						|| isLoneOrDeclarationExport(current, previous)
					) {
						return EMPTY_LINES.declaration;
					}

					// One of following:
					// - Standalone JSDoc comments
					// - JSDoc import comments
					if (isJSDoc(current.node)) {
						return isJSDocImport(current.node) && isImport(previous.node)
							? EMPTY_LINES.docImport
							: EMPTY_LINES.declaration;
					}
				},
				after(current, next) {
					// One of following:
					// - Last import declarations
					if (current === lastImport) {
						return isJSDocImport(next.node)
							? EMPTY_LINES.docImport
							: EMPTY_LINES.declaration;
					}

					// One of following:
					// - Class and function declarations
					// - Standalone JSDoc comments
					// - Units with JSDoc comments
					// - Export declarations if:
					//   - the next unit isn't an export declaration
					//   - it's an exported class or function declaration
					if (
						isDeclaration(current.node)
						|| isJSDoc(current.node)
						|| hasJSDoc(current)
						|| isLoneOrDeclarationExport(current, next)
					) {
						return EMPTY_LINES.declaration;
					}
				},
			});
		},
		ClassBody(node) {
			requireEmptyLines({
				context,
				units: createUnits(context, node),
				adjacent(current) {
					// One of following:
					// - Method declarations
					// - Standalone JSDoc comments
					// - Units with JSDoc comments
					if (
						isMethod(current.node)
						|| isJSDoc(current.node)
						|| hasJSDoc(current)
					) {
						return EMPTY_LINES.nestedMember;
					}
				},
			});
		},
		FunctionDeclaration: nestedDeclaration,
		FunctionExpression: nestedDeclaration,
	};
}



/**
 * The rule definition.
 *
 * @type {Rule.RuleModule}
 */
const rule = {
	meta: {
		type: 'layout',
		docs: {
			description: 'Enforce consistent empty lines between two statements.',
		},
		fixable: 'whitespace',
		languages: [
			'js/js',
		],
		messages: {
			'require-empty-lines-before': 'Expected {{expected}} empty {{lines}} before this {{type}}, but found {{count}}.',
			'require-empty-lines-after': 'Expected {{expected}} empty {{lines}} after this {{type}}, but found {{count}}.',
		},
		schema: [],
	},
	create,
};



export default rule;
