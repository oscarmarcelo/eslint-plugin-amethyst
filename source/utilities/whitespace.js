/**
 * @import {Rule} from 'eslint';
 * @import {Node} from 'estree';
 * @import {Unit} from '../rules/empty-lines';
 */



/**
 * Get the amount of lines between nodes or code units.
 *
 * @internal
 *
 * @param {Node | Unit} previous - The node or unit to use as starting boundary.
 * @param {Node | Unit} next - The node or unit to use as ending boundary.
 *
 * @returns {number} The amount of empty lines between nodes or units.
 */
export function emptyLinesBetween(previous, next) {
	return Math.max(0, next.loc.start.line - previous.loc.end.line - 1);
}



/**
 * Get the indentation of a node.
 *
 * @internal
 *
 * @param {Rule.RuleContext} context - The ESLint rule context.
 * @param {Node} node - The node whose starting line determines the indentation.
 *
 * @returns {string} The leading spaces or tabs on that line.
 */
export function getNodeIndentation(context, node) {
	const line = context.sourceCode.lines[(node?.loc?.start?.line || 0) - 1] ?? '';

	return line.match(/^[\t ]*/v)[0];
}
