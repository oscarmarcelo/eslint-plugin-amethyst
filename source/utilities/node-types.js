import {parse} from 'comment-parser';

/**
 * @import {Node, Comment} from 'estree';
 */



/**
 * Check whether a node is a class or function declaration.
 *
 * @internal
 *
 * @param {Node | null | undefined} node - The node to check.
 *
 * @returns {boolean} Whether the node is a class or function declaration.
 */
export function isDeclaration(node) {
	return node?.type === 'ClassDeclaration'
		|| node?.type === 'FunctionDeclaration';
}



/**
 * Check whether a node is an export declaration.
 *
 * @internal
 *
 * @param {Node | null | undefined} node - The node to check.
 *
 * @returns {boolean} Whether the node is an export declaration.
 */
export function isExport(node) {
	return node?.type?.startsWith('Export') ?? false;
}



/**
 * Check whether a node is an import declaration.
 *
 * @internal
 *
 * @param {Node | null | undefined} node - The node to check.
 *
 * @returns {boolean} Whether the node is an import declaration.
 */
export function isImport(node) {
	return node?.type === 'ImportDeclaration';
}



/**
 * Check whether a node is a JSDoc comment.
 *
 * @internal
 *
 * @param {Node | Comment | null | undefined} node - The node to check.
 *
 * @returns {boolean} Whether the node is a JSDoc comment.
 */
export function isJSDoc(node) {
	return node?.type === 'Block'
		&& node?.value.startsWith('*');
}



/**
 * Check whether a JSDoc comment contains only import-related type declarations.
 * Free-text descriptions are allowed, but not the `@description` tag.
 *
 * @internal
 *
 * @param {Node | Comment} node - The node to check.
 *
 * @returns {boolean} Whether the comment contains only import-related type declarations.
 */
export function isJSDocImport(node) {
	if (!isJSDoc(node)) {
		return false;
	}

	// ESLint exposes only the value, but the parser expects the comment delimiters.
	const [comment] = parse(`/*${node.value}*/`);

	if (comment.tags.length === 0) {
		return false;
	}

	// An unrelated tag makes this a regular JSDoc comment.
	return comment.tags.every(tag =>
		tag.tag === 'import'
		|| (
			tag.tag === 'typedef'
			&& /\bimport\s*\(/v.test(tag.type)
		),
	);
}



/**
 * Check whether a node is a method definition.
 *
 * @internal
 *
 * @param {Node | null | undefined} node - The node to check.
 *
 * @returns {boolean} Whether the node is a method definition.
 */
export function isMethod(node) {
	return node?.type === 'MethodDefinition';
}
