#!/usr/bin/env npx -y tsx watch

import { generateAndWriteCombinedMarkdown } from "./helpers";
import { default as iterator } from "./kits/iterator";

const boards: {
	board: any;
	demo: () => void;
}[] = [
	//
	iterator,
];

for (const board of boards) {
	generateAndWriteCombinedMarkdown(board.board);
	board.demo();
}
