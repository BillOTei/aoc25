import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";

const YEAR = 2025;
const DAY = 1;

// problem url  : https://adventofcode.com/2025/day/1

async function p2025day1_part1(input: string, ...params: any[]) {
	const regex = /\d+/gm;
	const rotations = input.split(/\n/);
	const spin = (dial: number, v: number, d: string): number => {
		if (d === "L") {
			return (((dial - v) % 100) + 100) % 100;
		} else {
			return (dial + v) % 100;
		}
	};
	const go = (count: number, dial: number, [rotation, list]: [string, string[]]): number => {
		const [_, direction, amount] = rotation.split(/(L|R)/);
		const newDial = spin(dial, +amount, direction);
		const [head, ...tail] = list;

		if (list.length <= 0) {
			return count;
		}
		return go(newDial === 0 ? count + 1 : count, newDial, [head, tail]);
	};

	const [head, ...tail] = rotations;

	const test = go(0, 50, [head, tail]);

	return `${test}`;
}

async function p2025day1_part2(input: string, ...params: any[]) {
	const regex = /\d+/gm;
	const rotations = input.split(/\n/);
	function applyDelta(pos: number, delta: number, direction: string) {
		const loops = Math.floor(delta / 100);
		const newPos = direction === "L" ? (((pos - delta) % 100) + 100) % 100 : (pos + delta) % 100;
		let crossings = 0;
		let counter = pos;

		if (direction === "R") {
			for (let index = pos; index < pos + delta; index++) {
				if (counter + 1 > 99) {
					crossings += 1;
					counter = 0;
				} else {
					counter += 1;
				}
			}
		} else {
			for (let index = pos; index <= pos + delta; index++) {
				if (counter - 1 < 0) {
					if (index > 0) {
						crossings += 1;
					}
					counter = 99;
				} else {
					counter -= 1;
				}
			}
		}

		return {
			newPos,
			crossings,
		};
	}
	const go = (count: number, dial: number, [rotation, list]: [string, string[]]): number => {
		const [_, direction, amount] = rotation.split(/(L|R)/);
		const { newPos, crossings } = applyDelta(dial, +amount, direction);
		const [head, ...tail] = list;

		if (list.length <= 0) {
			return count + crossings;
		}
		return go(count + crossings, newPos, [head, tail]);
	};

	const [head, ...tail] = rotations;

	const test = go(0, 50, [head, tail]);

	return `${test}`;
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`,
			expected: "3",
		},
	];
	const part2tests: TestCase[] = [
		{
			input: `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`,
			expected: "6",
		},
	];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2025day1_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2025day1_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2025day1_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2025day1_part2(input));
	const part2After = performance.now();

	logSolution(1, 2025, part1Solution, part2Solution);

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
