#!/usr/bin/env npx -y tsx watch

import { Board, BreadboardNode, InputValues, KitConstructor, LogProbe, NodeValue, OutputValues } from "@google-labs/breadboard";
import { KitBuilder } from "@google-labs/breadboard/kits";
import fs from 'fs';
import path from 'path';


////////////////////////////////////////////////////////////////////////////////

const board: Board = new Board({
	title: "Board",
});

////////////////////////////////////////////////////////////////////////////////

const hnKitBuilder: KitConstructor<any> = new KitBuilder({
	url: "npm:demo-kit"
}).build({
	toPercentage: async function (inputs: InputValues): Promise<void | Partial<Record<string, NodeValue>>> {
		const value = <number>inputs.val;
		return { percentage: `${Math.round(value * 100)}%` };
	}
});
const kit = board.addKit(hnKitBuilder);

////////////////////////////////////////////////////////////////////////////////

const inputNode: BreadboardNode<InputValues, OutputValues> = board.input();
const outputNode: BreadboardNode<InputValues, OutputValues> = board.output();

const percentageNode = kit.toPercentage();

inputNode.wire("*", percentageNode);
percentageNode.wire("percentage", outputNode);

////////////////////////////////////////////////////////////////////////////////

(async () => {
	for await (const stop of board.run({
		probe: new LogProbe()
	})) {
		if (stop.type === "input") {
			stop.inputs = { val: Math.random() };
		} else if (stop.type === "output") {
			console.log(stop.outputs);
		}
	}
})();

////////////////////////////////////////////////////////////////////////////////
export default board;
////////////////////////////////////////////////////////////////////////////////

generateAndWriteCombinedMarkdown(board);

function writeFiles(board: Board, name = board.title, dir = "./output") {
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

function generateAndWriteCombinedMarkdown(board: Board, name = board.title, dir = "./output") {
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

function writeCombinedMarkdown(dir: string, name: string, markdownTemplate: string) {
	const mdFilepath = path.resolve(path.join(dir, "markdown", `${name}.md`));
	fs.mkdirSync(path.dirname(mdFilepath), { recursive: true });
	fs.writeFileSync(mdFilepath, markdownTemplate);
	console.log("wrote", `"${mdFilepath}"`);
}

