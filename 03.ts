import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";

const YEAR = 2025;
const DAY = 3;

// solution path: /Users/alexandre.teilhet/IdeaProjects/advent-of-code25/years/2025/03/index.ts
// data path    : /Users/alexandre.teilhet/IdeaProjects/advent-of-code25/years/2025/03/data.txt
// problem url  : https://adventofcode.com/2025/day/3

async function p2025day3_part1(input: string, ...params: any[]) {
	const findMax = (listStr: string): number => {
		const list = listStr.split("");
		let results = [];
		for (let i = 0; i < list.length - 1; i++) {
			for (let j = i + 1; j < list.length; j++) {
				results.push(Number(`${list[i]}${list[j]}`));
			}
		}

		return Math.max(...results);
	};

	const banks = input.split("\n");
	const jolts = banks.map(b => findMax(b));
	const sum = jolts.reduce((a, b) => a + b);

	return `${sum}`;
}

async function p2025day3_part2(input: string, ...params: any[]) {
	const findMax = (listStr: string): number => {
		const list = listStr.split("");
		const len = list.length;
		const windowIdx = 11;
		let offsetIdx = 0;
		let r = "";

		for (let i = windowIdx; i >= 0; i--) {
			let max = -Infinity;
			for (let index = offsetIdx; index < len - i; index++) {
				const element = Number(list[index]);
				if (element > max) {
					max = element;
					offsetIdx = index + 1;
				}
			}
			r = r + `${max}`;
		}

		return Number(r);
	};

	const banks = input.split("\n");
	const jolts = banks.map(b => findMax(b));
	const sum = jolts.reduce((a, b) => a + b);

	return `${sum}`;
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `987654321111111
811111111111119
234234234234278
818181911112111`,
			expected: "357",
		},
	];
	const part2tests: TestCase[] = [
		{
			input: `987654321111111
811111111111119
234234234234278
818181911112111`,
			expected: "3121910778619",
		},
	];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2025day3_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2025day3_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2025day3_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2025day3_part2(input));
	const part2After = performance.now();

	logSolution(3, 2025, part1Solution, part2Solution);

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
