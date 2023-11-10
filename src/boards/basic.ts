import {
	Board,
	BreadboardNode,
	InputValues,
	KitConstructor,
	NodeValue,
	OutputValues,
} from "@google-labs/breadboard";
import { KitBuilder } from "@google-labs/breadboard/kits";

////////////////////////////////////////////////////////////////////////////////

const basic: Board = new Board({
	title: "Board",
});

////////////////////////////////////////////////////////////////////////////////

const hnKitBuilder: KitConstructor<any> = new KitBuilder({
	url: "npm:demo-kit",
}).build({
	toPercentage: async function (
		inputs: InputValues
	): Promise<void | Partial<Record<string, NodeValue>>> {
		const value = <number>inputs.val;
		return { percentage: `${Math.round(value * 100)}%` };
	},
});
const kit = basic.addKit(hnKitBuilder);

////////////////////////////////////////////////////////////////////////////////

const inputNode: BreadboardNode<InputValues, OutputValues> = basic.input();
const outputNode: BreadboardNode<InputValues, OutputValues> = basic.output();

const percentageNode = kit.toPercentage();

inputNode.wire("*", percentageNode);
percentageNode.wire("percentage", outputNode);
inputNode.wire("*", outputNode);

////////////////////////////////////////////////////////////////////////////////

export default basic;

////////////////////////////////////////////////////////////////////////////////
