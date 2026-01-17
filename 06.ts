import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";

const YEAR = 2025;
const DAY = 6;

async function p2025day6_part1(input: string, ...params: any[]) {
	let res = 0;
	const rows = input.split("\n");
	const operations = rows[rows.length - 1].split(/\s+/gm);
	delete rows[rows.length - 1];
	const numbers = rows.map(l => l.split(/\s+/gm).filter(v => v));
	const inverted = numbers[0].map((_, colIndex) => numbers.map(row => Number(row[colIndex])));
	for (let index = 0; index < inverted.length; index++) {
		const elements = inverted[index];
		const op = operations[index];
		const calculus = elements.reduce((acc, e) => (op === "+" ? acc + e : acc * e), op === "+" ? 0 : 1);
		res += calculus;
	}

	return `${res}`;
}

async function p2025day6_part2(input: string, ...params: any[]) {
	let res = 0;
	const groupSize = 3;
	let rows = input.split("\n");
	const operations = rows[rows.length - 1].split(/\s+/gm);
	delete rows[rows.length - 1];
	const numbers = rows.map(l => {
		const list = l.split("");
		let res = [];
		let curr = "";
		const len = list.length;
		for (let i = 0; i < len; i++) {
			const element = list[i];
			if (curr.length === groupSize) {
				res.push(curr);
				curr = "";
			} else if (i === len - 1) {
				res.push(curr.concat(element));
			} else {
				curr = curr.concat(element);
			}
		}
		return res;
	});
	const inverted = numbers[0].map((_, colIndex) => numbers.map(row => row[colIndex].split("").reverse().join("")));
	const getNumberAtIndex = (pos: number, idx: number, elements: string[]): string => {
		const list = elements.slice(pos);

		return list.reduce((acc, d) => (d.charAt(idx) ? acc.concat(d.charAt(idx)) : acc), String(""));
	};
	interface Longest {
		v: string;
		pos: number;
	}
	const findLongest = (l: string[]): Longest => {
		let pos = 0;
		let v = "";
		for (let index = 0; index < l.length; index++) {
			const element = l[index];
			if (element && element.length > v.length) {
				v = element;
				pos = index;
			}
		}

		return { v, pos };
	};

	const test = getNumberAtIndex(0, 2, inverted[2]);

	for (let index = 0; index < inverted.length; index++) {
		const elements = inverted[index];
		const op = operations[index];
		let calculus = 0;

		const [v1, v2, v3, v4] = elements;
		const longest = findLongest(elements);
		let numbers = [];
		for (let d = 0; d < v1.length; d++) {
			numbers.push(getNumberAtIndex(0, d, elements));
		}
		if (v1.length < v2.length) {
			for (let d = v1.length; d < v2.length; d++) {
				numbers.push(getNumberAtIndex(1, d, elements));
			}
		}
		if (v2.length < v3.length) {
			for (let d = v2.length; d < v3.length; d++) {
				numbers.push(getNumberAtIndex(2, d, elements));
			}
		}

		if (v4) {
			if (v3.length < v4.length) {
				for (let d = v3.length; d < v4.length; d++) {
					numbers.push(getNumberAtIndex(3, d, elements));
				}
			}
		}

		const l = "";
	}

	return `${res}`;
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `,
			expected: "4277556",
		},
	];
	const part2tests: TestCase[] = [
		{
			input: `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `,
			expected: "3263827",
		},
	];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2025day6_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2025day6_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2025day6_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2025day6_part2(input));
	const part2After = performance.now();

	logSolution(6, 2025, part1Solution, part2Solution);

	log(chalk.gray("--- Performance ---"));
	log(chalk.gray(`Part 1: ${util.formatTime(part1After - part1Before)}`));
	log(chalk.gray(`Part 2: ${util.formatTime(part2After - part2Before)}`));
	log();
}

run()
	.then(() => {
		process.exit();
	})
	.catch(error => {
		throw error;
	});
