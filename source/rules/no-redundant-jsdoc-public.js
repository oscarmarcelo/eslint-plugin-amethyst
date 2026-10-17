import {parse} from 'comment-parser';

import {isJSDoc} from '../utilities/node-types.js';

/**
 * @import {Rule} from 'eslint';
 */



/**
 * Get the source ranges of each line in a comment.
 *
 * @internal
 *
 * @param {string} text - The comment text.
 *
 * @returns {{start: number, end: number, endWithNewline: number}[]} The comment's line ranges.
 */
function getLines(text) {
	const lines = [];
	const newlinePattern = /\r\n|\n|\r/gv;

	let start = 0;

	for (const match of text.matchAll(newlinePattern)) {
		lines.push({
			start,
			end: match.index,
			endWithNewline: match.index + match[0].length,
		});

		start = match.index + match[0].length;
	}

	if (start < text.length || lines.length === 0) {
		lines.push({
			start,
			end: text.length,
			endWithNewline: text.length,
		});
	}

	return lines;
}



/**
 * Get the source lines belonging to a parsed annotation.
 *
 * @internal
 *
 * @param {string} text - The comment text.
 * @param {object} block - The parsed JSDoc block.
 * @param {object} annotation - The parsed annotation.
 *
 * @returns {{line: object, range: object}[] | undefined} The source lines and ranges.
 */
function getAnnotationLines(text, block, annotation) {
	const lines = getLines(text);
	const firstLineNumber = block.source[0]?.number;

	if (firstLineNumber === undefined) {
		return;
	}

	const source = [...annotation.source];

	// An annotation may include trailing blank lines in its parsed source.
	while (
		source.length > 1
		&& /^\s*\*\s*$/v.test(source.at(-1).source.replace(/\r$/v, ''))
	) {
		source.pop();
	}

	const annotationLines = source.map(line => {
		const range = lines[line.number - firstLineNumber];

		return (
			!range
			|| text.slice(range.start, range.end).replace(/\r$/v, '') !== line.source.replace(/\r$/v, '')
		)
			? undefined
			: {
				line,
				range,
			};
	});

	return annotationLines.some(line => !line)
		? undefined
		: annotationLines;
}



/**
 * Create a fixer for redundant `@public` annotations.
 *
 * @internal
 *
 * @param {string} text - The comment text.
 * @param {object} block - The parsed JSDoc block.
 * @param {object[]} publicAnnotations - The redundant `@public` annotations.
 * @param {number} commentStart - The comment's start offset in the source file.
 *
 * @returns {((fixer: Rule.RuleFixer) => Rule.Fix[] | Rule.Fix) | undefined} The fixer, if safe.
 */
function createFixer(text, block, publicAnnotations, commentStart) {
	const annotationLines = publicAnnotations.map(annotation => getAnnotationLines(text, block, annotation));

	if (annotationLines.some(lines => !lines)) {
		return;
	}

	const sourceLines = annotationLines.flat();

	// Inline comments need their own handling.
	if (
		!/[\n\r]/v.test(text)
		&& sourceLines.some(({line}) => line.tokens.delimiter === '/**')
	) {
		if (
			publicAnnotations.length !== 1
			|| block.tags.length !== 1
		) {
			return;
		}

		const replacement = text.replace(
			/\/\*\*[\t ]*@public\b.*\*\//v,
			'/** */',
		);

		if (replacement === text) {
			return;
		}

		return fixer => fixer.replaceTextRange(
			[commentStart, commentStart + text.length],
			replacement,
		);
	}

	const ranges = [];

	for (const {line, range} of sourceLines) {
		const lineText = text.slice(range.start, range.end);
		const {tokens} = line;

		// Preserve the opening delimiter and remove trailing whitespace.
		if (tokens.delimiter === '/**') {
			const annotationStart = lineText.indexOf('@public');

			if (annotationStart === -1) {
				return;
			}

			ranges.push({
				start: range.start,
				end: range.end,
				text: lineText.slice(0, annotationStart).trimEnd(),
			});

			continue;
		}

		// Preserve the closing delimiter, removing the annotation and its leading asterisk when they share a line.
		if (tokens.end === '*/') {
			const delimiterStart = lineText.lastIndexOf('*/');
			const prefix = /^[\t ]*\*/v.exec(lineText)?.[0];

			if (delimiterStart === -1 || prefix === undefined) {
				return;
			}

			ranges.push({
				start: range.start,
				end: range.end,
				text: `${prefix.slice(0, -1)}*/`,
			});

			continue;
		}

		// Remove the entire annotation line, including its newline.
		ranges.push({
			start: range.start,
			end: range.endWithNewline,
			text: '',
		});
	}

	if (ranges.length === 0) {
		return;
	}

	return fixer => ranges.map(({start, end, text: replacement}) => (
		fixer.replaceTextRange(
			[commentStart + start, commentStart + end],
			replacement,
		)
	));
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
	return {
		Program() {
			for (const comment of context.sourceCode.getAllComments()) {
				if (!isJSDoc(comment)) {
					continue;
				}

				const text = context.sourceCode.getText(comment);
				const [block] = parse(text);

				if (!block) {
					continue;
				}

				const publicAnnotations = block.tags.filter(({tag}) => tag === 'public');

				if (
					publicAnnotations.length === 0
					|| block.tags.some(({tag}) => ['override', 'inheritdoc'].includes(tag))
				) {
					continue;
				}

				const fix = createFixer(text, block, publicAnnotations, comment.range[0]);

				context.report({
					node: comment,
					messageId: 'redundant',
					...(
						fix
						&& {
							fix(fixer) {
								return fix(fixer);
							},
						}
					),
				});
			}
		},
	};
}



/**
 * The rule definition.
 *
 * @type {Rule.RuleModule}
 */
const rule = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Disallow redundant `@public` JSDoc annotations',
		},
		fixable: 'code',
		languages: [
			'js/js',
		],
		messages: {
			redundant: 'Remove redundant @public annotation.',
		},
		schema: [],
	},
	create,
};



export default rule;
