import _, { range } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";

const YEAR = 2025;
const DAY = 5;

// solution path: /Users/alexandre.teilhet/IdeaProjects/advent-of-code25/years/2025/05/index.ts
// data path    : /Users/alexandre.teilhet/IdeaProjects/advent-of-code25/years/2025/05/data.txt
// problem url  : https://adventofcode.com/2025/day/5

async function p2025day5_part1(input: string, ...params: any[]) {
	const [freshRanges, spoilt] = input.split("\n\n").map(l => l.split("\n"));
	const isFresh = (r: string, id: string): boolean => {
		const [low, high] = r.split("-").map(v => Number(v));
		const nbId = Number(id);

		return nbId <= high && nbId >= low;
	};
	const checkIsFresh = (ranges: string[], id: string): boolean => {
		for (let i = 0; i < ranges.length; i++) {
			const r = ranges[i];
			if (isFresh(r, id)) {
				return true;
			}
		}

		return false;
	};
	const res = spoilt.map(id => checkIsFresh(freshRanges, id));

	return `${res.filter(b => b).length}`;
}

interface Range {
	start: number;
	end: number;
}

async function p2025day5_part2(input: string, ...params: any[]) {
	const [freshRanges, _] = input.split("\n\n").map(l => l.split("\n"));
	let ranges: Range[] = [];
	let mergedRanges: Range[] = [];
	for (let i = 0; i < freshRanges.length; i++) {
		const r = freshRanges[i];
		const [start, end] = r.split("-");

		ranges.push({ start: Number(start), end: Number(end) });
	}
	ranges.sort((a, b) => a.start - b.start || a.end - b.end);
	mergedRanges.push(ranges[0]);
	for (let index = 1; index < ranges.length; index++) {
		const a = ranges[index];
		const mergedLength = mergedRanges.length;
		const prev = mergedRanges[mergedLength - 1];
		if (a.start <= prev.end) {
			mergedRanges[mergedLength - 1] = { ...prev, end: Math.max(a.end, prev.end) };
		} else {
			mergedRanges.push({ ...a });
		}
	}

	return `${mergedRanges.reduce((acc, r) => acc + 1 + (r.end - r.start), 0)}`;
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `3-5
10-14
16-20
12-18

1
5
8
11
17
32`,
			expected: "3",
		},
	];
	const part2tests: TestCase[] = [
		{
			input: `3-5
3-4
10-14
16-20
12-18

1
5
8
11
17
32`,
			expected: "14",
		},
	];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2025day5_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2025day5_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2025day5_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2025day5_part2(input));
	const part2After = performance.now();

	logSolution(5, 2025, part1Solution, part2Solution);

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
