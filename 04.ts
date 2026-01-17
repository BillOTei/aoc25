import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";

const YEAR = 2025;
const DAY = 4;

interface Roll {
	x: number;
	y: number;
}

const reachables = (map: string[][]): Roll[] => {
	const depth = map.length;
	const width = map[0].length;
	let res = [];
	for (let y = 0; y < depth; y++) {
		for (let x = 0; x < width; x++) {
			if (map[y][x] !== "@") {
				continue;
			}
			let count = 0;
			for (let dy = -1; dy < 2; dy++) {
				for (let dx = -1; dx < 2; dx++) {
					if (dy === 0 && dx === 0) {
						continue;
					}
					try {
						if (map[y - dy][x - dx] === "@") {
							count++;
						}
					} catch (error) {}
				}
			}
			if (count < 4) {
				res.push({ x, y });
			}
		}
	}

	return res;
};

async function p2025day4_part1(input: string, ...params: any[]) {
	const map: string[][] = input.split("\n").map(l => l.split(""));
	const res = reachables(map);

	return `${res.length}`;
}

async function p2025day4_part2(input: string, ...params: any[]) {
	let map: string[][] = input.split("\n").map(l => l.split(""));
	let reachableRolls = [];
	let res = 0;
	reachableRolls = reachables(map);
	res += reachableRolls.length;
	while (reachableRolls.length > 0) {
		reachableRolls.forEach(r => {
			map[r.y][r.x] = ".";
		});
		reachableRolls = reachables(map);
		res += reachableRolls.length;
	}

	return `${res}`;
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`,
			expected: "13",
		},
	];
	const part2tests: TestCase[] = [
		{
			input: `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`,
			expected: "43",
		}
	];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2025day4_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2025day4_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2025day4_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2025day4_part2(input));
	const part2After = performance.now();

	logSolution(4, 2025, part1Solution, part2Solution);

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
