#!/usr/bin/env npx -y tsx watch

import { LogProbe } from "@google-labs/breadboard";
import { generateAndWriteCombinedMarkdown } from "./helpers";
import basic from "./boards/basic";

const boards = [basic];

for (const board of boards) {
	generateAndWriteCombinedMarkdown(board);

	(async () => {
		for await (const stop of board.run({
			probe: new LogProbe(),
		})) {
			if (stop.type === "input") {
				stop.inputs = {
					val: Math.random(),
				};
			} else if (stop.type === "output") {
				console.log(stop.outputs);
			}
		}
	})();
}
