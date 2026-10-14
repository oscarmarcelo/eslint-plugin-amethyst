import {isJSDocImport} from './node-types.js';

/**
 * @import {Rule} from 'eslint';
 * @import {Node, Comment} from 'estree';
 */



/**
 * Get the leading comments attached to a node.
 *
 * A comment is attached when it directly precedes the node without any empty lines in between.
 * Consecutive line comments are returned together.
 * Only the nearest block comment is attached.
 * A blank line, a comment of another kind, a hashbang, a JSDoc import, or an inline comment stops attachment.
 *
 * @internal
 *
 * @param {Rule.RuleContext} context - The ESLint rule context.
 * @param {Node} node - The node to get attached comments for.
 *
 * @returns {Comment[]} The comments attached to the node, in source order.
 */
export function getLeadingComments(context, node) {
	const comments = context.sourceCode.getCommentsBefore(node);
	const attachedComments = [];

	for (const comment of comments.toReversed()) {
		if (
			comment.type === 'Shebang'
			|| isJSDocImport(comment)
			|| isInlineComment(context, comment)
			|| comment.loc.end.line !== (attachedComments[0] ?? node).loc.start.line - 1
			|| (
				attachedComments.length > 0
				&& (
					comment.type !== 'Line'
					|| comment.type !== attachedComments[0].type
				)
			)
		) {
			break;
		}

		attachedComments.unshift(comment);
	}

	return attachedComments;
}



/**
 * Determine whether a comment is inline with code.
 *
 * @internal
 *
 * @param {Rule.RuleContext} context - The ESLint rule context.
 * @param {Comment} comment - The comment to check.
 *
 * @returns {boolean} Whether the comment shares a line with code before or after it.
 */
export function isInlineComment(context, comment) {
	const tokenBefore = context.sourceCode.getTokenBefore(comment, {
		includeComments: true,
	});

	const tokenAfter = context.sourceCode.getTokenAfter(comment, {
		includeComments: true,
	});

	// A comment is inline if it touches code on either side of its own lines.
	return tokenBefore?.loc.end.line === comment.loc.start.line
		|| tokenAfter?.loc.start.line === comment.loc.end.line;
}
