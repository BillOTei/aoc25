import _, { flip } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";

const YEAR = 2025;
const DAY = 6;

// solution path: /Users/alexandre.teilhet/IdeaProjects/advent-of-code25/years/2025/06/index.ts
// data path    : /Users/alexandre.teilhet/IdeaProjects/advent-of-code25/years/2025/06/data.txt
// problem url  : https://adventofcode.com/2025/day/6

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
		res += elements.reduce((acc, e) => (op === "+" ? acc + e : acc * e), op === "+" ? 0 : 1);
	}

	return `${res}`;
}

async function p2025day6_part2(input: string, ...params: any[]) {
	type Cell = { text: string; start: number };

	const parseByColumnsKeepingPadding = (src: string): string[][] => {
		const lines = src
			.replace(/\r\n/g, "\n")
			.split("\n")
			.filter(l => l.length > 0);

		// Extract tokens + their start index per line
		const rows: Cell[][] = lines.map(line => {
			const cells: Cell[] = [];
			for (const m of line.matchAll(/\S+/g)) {
				cells.push({ text: m[0], start: m.index ?? 0 });
			}
			return cells;
		});

		const colCount = Math.max(...rows.map(r => r.length));

		// Max width per column (by token length)
		const maxLen: number[] = Array.from({ length: colCount }, (_, c) =>
			Math.max(...rows.map(r => r[c]?.text.length ?? 0))
		);

		// Decide alignment per column from start positions
		// if start positions vary -> right aligned; else left aligned
		const rightAligned: boolean[] = Array.from({ length: colCount }, (_, c) => {
			const starts = rows.map(r => r[c]?.start).filter((v): v is number => typeof v === "number");
			return new Set(starts).size > 1;
		});

		// Pad each cell to maxLen using inferred alignment
		const paddedRows: string[][] = rows.map(r =>
			Array.from({ length: colCount }, (_, c) => {
				const t = r[c]?.text ?? "";
				return rightAligned[c] ? t.padStart(maxLen[c], " ") : t.padEnd(maxLen[c], " ");
			})
		);

		// Transpose rows -> columns
		const columns: string[][] = Array.from({ length: colCount }, (_, c) => paddedRows.map(r => r[c]));

		return columns;
	};
	let rows = input.split("\n");
	const operations = rows[rows.length - 1].split(/\s+/gm);
	let parsed = parseByColumnsKeepingPadding(input);
	parsed.forEach(l => l.pop());
	let res = 0;
	const flipped = parsed.map(col => {
		const maxLen = col.reduce(
			(acc, v, x) =>
				(col[x - 1] ?? "").length > v.replace(/\s+/g, "").length ? acc : v.replace(/\s+/g, "").length,
			0
		);
		let flippedSeq = [];
		for (let i = 0; i < maxLen; i++) {
			let acc = "";
			col.forEach(v => {
				if (v.charAt(i)) {
					acc = acc.concat(v.charAt(i));
				}
			});
			flippedSeq.push(acc);
		}

		return flippedSeq;
	});
	for (const [i, l] of flipped.entries()) {
		const op = operations[i];
		res += l.reduce((acc, v) => (op === "+" ? acc + Number(v) : acc * Number(v)), op === "+" ? 0 : 1);
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
