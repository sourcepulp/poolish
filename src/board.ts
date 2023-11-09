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

writeFiles(board);

function writeFiles(board: Board, name = board.title, dir = "./output") {
	if (!name) {
		throw new Error("Board must have a title or a name must be suplied");
	}

	writeMermaid(dir, name, board);
	writeJson(dir, name, board);
}

function writeJson(dir: string, name: string, board: Board) {
	const jsonFilePath = path.resolve(path.join(dir, "json", `${name}.json`));
	fs.mkdirSync(path.dirname(jsonFilePath), { recursive: true });
	const jsonContent = JSON.stringify(board, null, 2);
	fs.writeFileSync(jsonFilePath, jsonContent);
	console.log("wrote", `"${jsonFilePath}"`);
}

function writeMermaid(dir: string, name: string, board: Board) {
	const mdFilepath = path.resolve(path.join(dir, "markdown", `${name}.md`));
	fs.mkdirSync(path.dirname(mdFilepath), { recursive: true });
	fs.writeFileSync(mdFilepath, `\`\`\`mermaid\n${board.mermaid()}\n\`\`\``);
	console.log("wrote", `"${mdFilepath}"`);
}

