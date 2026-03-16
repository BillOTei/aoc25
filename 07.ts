import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";

const YEAR = 2025;
const DAY = 7;

// solution path: /Users/alexandre.teilhet/IdeaProjects/advent-of-code25/years/2025/07/index.ts
// data path    : /Users/alexandre.teilhet/IdeaProjects/advent-of-code25/years/2025/07/data.txt
// problem url  : https://adventofcode.com/2025/day/7

async function p2025day7_part1(input: string, ...params: any[]) {
	const manifold = input.split("\n");
	const start = manifold[0].indexOf("S");
	let splits = 0;
	let beams = Array<boolean>(manifold[0].length).fill(false);
	beams[start] = true;

	for (let row = 1; row < manifold.length; row++) {
		for (let col = 0; col < manifold[0].length; col++) {
			if (manifold[row][col] === "^" && beams[col]) {
				beams[col - 1] = true;
				beams[col + 1] = true;
				beams[col] = false;

				splits++;
			}
		}
	}

	return `${splits}`;
}

async function p2025day7_part2(input: string, ...params: any[]) {
	const manifold = input.split("\n");
	const start = manifold[0].indexOf("S");
	let beams = Array<number>(manifold[0].length).fill(0);
	beams[start] = 1;

	for (let row = 1; row < manifold.length; row++) {
		for (let col = 0; col < manifold[0].length; col++) {
			if (manifold[row][col] === "^" && beams[col] > 0) {
				beams[col - 1] += beams[col];
				beams[col + 1] += beams[col];
				beams[col] = 0;
			}
		}
	}

	return `${beams.reduce((acc, x) => acc + x)}`;
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`,
			expected: "21",
		},
	];
	const part2tests: TestCase[] = [
		{
			input: `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`,
			expected: "40",
		},
	];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2025day7_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2025day7_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2025day7_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2025day7_part2(input));
	const part2After = performance.now();

	logSolution(7, 2025, part1Solution, part2Solution);

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
