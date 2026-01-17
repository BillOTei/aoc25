import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";

const YEAR = 2025;
const DAY = 2;

async function p2025day2_part1(input: string, ...params: any[]) {
	const isValid = (id: string): boolean => {
		if (id.charAt(0) === "0") {
			return false;
		} else if (id.length % 2) {
			return true;
		}
		// const count = id.split("").reduce((acc, digit) => {
		// 	acc.set(digit, (acc.get(digit) || 0) + 1);

		// 	return acc;
		// }, new Map<string, number>());
		// const values = count.values().toArray()
		// const oddDigits = values.filter(v => v % 2 === 0);
		// const oddDigitsLength = values.reduce((a, b) => a + b,  0);

		// return oddDigitsLength !== id.length;
		const split = id.length / 2;

		return id.substring(0, split) !== id.substring(split);
	};
	const loopAndSum = (range: string): number => {
		const [v1, v2] = range.split("-");
		let invalids = [];
		for (let index = Number(v1); index <= Number(v2); index++) {
			if (!isValid("" + index)) {
				invalids.push(index);
			}
		}

		return invalids.reduce((a, b) => a + b, 0);
	};

	const ranges = input.split(",");
	const sums = ranges.map(r => loopAndSum(r));

	return sums.reduce((a, b) => a + b, 0);
}

async function p2025day2_part2(input: string, ...params: any[]) {
	const isValid = (id: string): boolean => {
		if (id.charAt(0) === "0") {
			return false;
		}

		const split = id.length / 2;
		for (let len = 1; len <= split; len++) {
			const splitList = id.match(new RegExp(`.{1,${len}}`, "g"));
			const count = splitList?.reduce((acc, l) => {
				acc.set(l, (acc.get(l) || 0) + 1);

				return acc;
			}, new Map<string, number>());
			const values = count?.values().toArray();
			if (values?.length === 1) {
				return false;
			}
		}

		return true;
	};
	const loopAndSum = (range: string): number => {
		const [v1, v2] = range.split("-");
		let invalids = [];
		for (let index = Number(v1); index <= Number(v2); index++) {
			if (!isValid("" + index)) {
				invalids.push(index);
			}
		}

		return invalids.reduce((a, b) => a + b, 0);
	};

	const ranges = input.split(",");
	const sums = ranges.map(r => loopAndSum(r));

	return sums.reduce((a, b) => a + b, 0);
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`,
			expected: "1227775554",
		},
	];
	const part2tests: TestCase[] = [
		{
			input: `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`,
			expected: "4174379265",
		},
	];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2025day2_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2025day2_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2025day2_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2025day2_part2(input));
	const part2After = performance.now();

	logSolution(2, 2025, part1Solution, part2Solution);

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
