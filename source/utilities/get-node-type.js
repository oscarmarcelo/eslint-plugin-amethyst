/**
 * @import {Node, Comment} from 'estree';
 */



/**
 * Get the user readable string of a node type.
 *
 * @internal
 *
 * @param {Node | Comment} node - The AST node or comment to get the type from.
 *
 * @returns {string} The human-readable node type.
 */
export default function getNodeType(node) {
	if (node.type.startsWith('Export')) {
		return 'export declaration';
	}

	return node.type
		.replaceAll(
			/(?<previousLetter>[a-z])(?<capitalizedLetter>[A-Z])/gv,
			'$<previousLetter> $<capitalizedLetter>',
		)
		.toLowerCase();
}
