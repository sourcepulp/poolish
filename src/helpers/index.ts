import path from 'path';
import { Board } from '@google-labs/breadboard';
import fs from 'fs';

export function writeCombinedMarkdown(dir: string, name: string, markdownTemplate: string) {
	const mdFilepath = path.resolve(path.join(dir, "markdown", `${name}.md`));
	fs.mkdirSync(path.dirname(mdFilepath), { recursive: true });
	fs.writeFileSync(mdFilepath, markdownTemplate);
	console.log("wrote", `"${mdFilepath}"`);
}function writeFiles(board: Board, name = board.title, dir = "./output") {
	if (!name) {
		throw new Error("Board must have a title or a name must be suplied");
	}

	generateAndWriteMarkdown(dir, name, board);
	generateAndWriteJson(dir, name, board);
}
function generateAndWriteJson(dir: string, name: string, board: Board) {
	const jsonContent = generateJson(board);
	writeJson(dir, name, jsonContent);
}
function writeJson(dir: string, name: string, jsonContent: string) {
	const jsonFilePath = path.resolve(path.join(dir, "json", `${name}.json`));
	fs.mkdirSync(path.dirname(jsonFilePath), { recursive: true });
	fs.writeFileSync(jsonFilePath, jsonContent);
	console.log("wrote", `"${jsonFilePath}"`);
}
function generateJson(board: Board) {
	return JSON.stringify(board, null, "\t");
}
function generateAndWriteMarkdown(dir: string, name: string, board: Board) {
	const markdown = generateMarkdown(board);
	writeMarkdown(dir, name, markdown);
}
function writeMarkdown(dir: string, name: string, markdown: string) {
	const mdFilepath = path.resolve(path.join(dir, "markdown", `${name}.md`));
	fs.mkdirSync(path.dirname(mdFilepath), { recursive: true });
	fs.writeFileSync(mdFilepath, markdown);
	console.log("wrote", `"${mdFilepath}"`);
}
function generateMarkdown(board: Board) {
	return `\`\`\`mermaid\n${board.mermaid()}\n\`\`\``;
}
export function generateAndWriteCombinedMarkdown(board: Board, name = board.title, dir = "./output") {
	if (!name) {
		throw new Error("Board must have a title or a name must be suplied");
	}

	const markdownTemplate = generateCombinedMarkdown(board, name);
	writeCombinedMarkdown(dir, name, markdownTemplate);
}
function generateCombinedMarkdown(board: Board, name: string = board.title) {
	if (!name) {
		throw new Error("Board must have a title or a name must be suplied");
	}

	const markdown = generateMarkdown(board);
	const json = generateJson(board);
	const jsonCodeBlock = `\`\`\`json\n${json}\n\`\`\``;
	const markdownTemplate = `# ${name}\n\n${markdown}\n\n${jsonCodeBlock}`;
	return markdownTemplate;
}

