export type BenchmarkResult = {
  /** Descriptive name of the benchmark (e.g. "divider – small string") */
  name: string;
  /** Total number of *measured* iterations */
  iterations: number;
  /** Wall‑clock time in **milliseconds** for all iterations combined */
  totalTime: number;
  /** Average time per iteration in **milliseconds** (totalTime / iterations) */
  averageTime: number;
  /** Fastest single‑iteration time observed (**ms**) */
  minTime: number;
  /** Slowest single‑iteration time observed (**ms**) */
  maxTime: number;
  /** Throughput expressed as **operations per second** (1_000 / averageTime) */
  operationsPerSecond: number;
};
  
export type BenchmarkOptions = {
  /** Number of iterations to *measure* (default: 1_000) */
  iterations?: number;
  /** Warm‑up iterations to run *without* measurement (default: 100) */
  warmupIterations?: number;
  /** Hard timeout in **ms** — abort benchmark if exceeded (default: 30_000ms) */
  timeout?: number;
};

/** Non‑overridable default options */
export const DEFAULT_OPTIONS: Required<BenchmarkOptions> = {
  iterations: 1_000,
  warmupIterations: 100,
  timeout: 30 * 1000,
} as const;

/**
 * Run a micro-benchmark for a synchronous (side-effect-free) function and
 * return aggregated timing statistics.
 *
 * The function is executed in three phases:
 * 1. **Warm-up** – executed `warmupIterations` times; measurements are *ignored* so
 *    that JIT compilation and CPU cache effects stabilise.
 * 2. **Measured loop** – executed `iterations` times; every single-iteration
 *    duration is captured in the `times[]` array.
 * 3. **Summary** – derives min / max / average timings as well as overall
 *    throughput (ops/sec) from the collected data.
 *
 * @template T
 * @param {string} name – Human-readable name to identify the benchmark in logs.
 * @param {() => T} fn – Function under test. Must be *deterministic* and
 *        *side-effect-free* so that repeated execution is safe.
 * @param {BenchmarkOptions} [options] – Fine-tune iteration counts, warm-up
 *        runs, or impose a hard timeout (in **milliseconds**).
 * @returns {BenchmarkResult} An object containing statistical metrics that can
 *          be further asserted or pretty-printed.
 *
 * @example
 * ```ts
 * const res = benchmark('divider – small string', () => divider('a,b,c'));
 * console.log(formatBenchmarkResult(res));
 * ```
 */
export function benchmark<T>(
  name: string,
  fn: () => T,
  options: BenchmarkOptions = {}
): BenchmarkResult {
  // ── Merge user‑provided options with library defaults ────────────────────
  const opts = { ...DEFAULT_OPTIONS, ...options } as const;

  // ── High‑precision timer shim (Node.js vs browser) ───────────────────────
  const now: () => number =
    typeof performance !== 'undefined'
      ? performance.now.bind(performance)
      : () => Number(process.hrtime.bigint()) / 1e6; // bigint → ms

  const times: number[] = [];

  // ── 1. Warm‑up ───────────────────────────────────────────────────────────
  for (let i = 0; i < opts.warmupIterations; i++) {
    fn();
  }

  // ── 2. Measured loop with optional timeout guard ────────────────────────
  const benchStart = now();
  for (let i = 0; i < opts.iterations; i++) {
    const iterStart = now();
    fn();
    const iterEnd = now();
    times.push(iterEnd - iterStart);

    // Abort early if wall‑clock timeout is exceeded
    if (now() - benchStart > opts.timeout) break;
  }
  const benchEnd = now();

  // ── 3. Statistics ────────────────────────────────────────────────────────
  const totalTime = benchEnd - benchStart;
  const measured = times.length; // could be < opts.iterations if timeout hit

  if (measured === 0) {
    throw new Error('Benchmark captured 0 iterations – check the setup.');
  }

  const sum = times.reduce((acc, t) => acc + t, 0);
  const averageTime = sum / measured;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  // ops/sec derived from *total* time for better precision when avg ≪ 1ms
  const operationsPerSecond = (measured / totalTime) * 1000;

  return {
    name,
    iterations: measured,
    totalTime,
    averageTime,
    minTime,
    maxTime,
    operationsPerSecond,
  };
}

/**
 * Compare multiple synchronous benchmark candidates and return their results,
 * along with the fastest implementation based on average time per iteration.
 *
 * All benchmarks are run independently using the same options, and their
 * results are returned in an array sorted by declaration order (not by speed).
 *
 * @template T – Tuple type representing return types of each function (optional)
 * @param benchmarks – Array of objects each containing:
 *   - `name`: A unique label for the function being benchmarked
 *   - `fn`: A synchronous, side-effect-free function to be measured
 * @param options – Optional benchmarking configuration (e.g. iteration count, timeout)
 * @returns An object with:
 *   - `results`: Array of BenchmarkResult for each implementation
 *   - `fastest`: The implementation with the lowest average time per iteration
 *
 * @example
 * ```ts
 * const { results, fastest } = compareBenchmarks([
 *   { name: 'impl A', fn: () => implA(data) },
 *   { name: 'impl B', fn: () => implB(data) }
 * ]);
 *
 * console.log(results.map(formatBenchmarkResult).join('\n\n'));
 * console.log(`Fastest: ${fastest.name}`);
 * ```
 */
export function compareBenchmarks<T extends any[]>(
  benchmarks: Array<{ name: string; fn: () => T[number] }>,
  options: BenchmarkOptions = {}
): { results: BenchmarkResult[]; fastest: BenchmarkResult } {
  const results = benchmarks.map(({ name, fn }) =>
    benchmark(name, fn, options)
  );

  const fastest = results.reduce((prev, current) =>
    prev.averageTime < current.averageTime ? prev : current
  );

  return { results, fastest };
}

/**
 * Assert that a benchmark result meets defined performance thresholds.
 *
 * This function throws an error if:
 * - The average time per iteration exceeds `maxAverageTime`
 * - The operations per second is lower than `minOperationsPerSecond` (if provided)
 *
 * @param result – The benchmark result object returned by `benchmark()`
 * @param maxAverageTime – The maximum allowed average time per iteration (in ms)
 * @param minOperationsPerSecond – Optional minimum required throughput (ops/sec)
 *
 * @throws {Error} If the benchmark fails to meet the provided thresholds.
 *
 * @example
 * ```ts
 * const result = benchmark('test case', () => myFn());
 * assertBenchmark(result, 5.0, 100); // Must be under 5ms, above 100 ops/sec
 * ```
 */
export function assertBenchmark(
  result: BenchmarkResult,
  maxAverageTime: number,
  minOperationsPerSecond?: number
): void {
  if (result.averageTime > maxAverageTime) {
    throw new Error(
      `Benchmark "${result.name}" failed: average time ${result.averageTime.toFixed(3)}ms exceeds maximum ${maxAverageTime}ms`
    );
  }

  if (
    typeof minOperationsPerSecond === 'number' &&
    result.operationsPerSecond < minOperationsPerSecond
  ) {
    throw new Error(
      `Benchmark "${result.name}" failed: ${result.operationsPerSecond.toFixed(0)} ops/sec below minimum ${minOperationsPerSecond} ops/sec`
    );
  }
}

/**
 * Format a benchmark result into a readable string block for console output.
 *
 * This function produces an aligned, indented multi-line string summarizing the
 * key performance metrics. Suitable for CLI inspection and simple CI logs.
 *
 * @param result – A `BenchmarkResult` object produced by the `benchmark()` function.
 * @returns A formatted string showing name, iteration count, timing breakdown, and throughput.
 *
 * @example
 * ```ts
 * const result = benchmark('divider - small input', () => divider('a,b,c'));
 * console.log(formatBenchmarkResult(result));
 * ```
 *
 * // Output:
 * // divider - small input:
 * //   Iterations: 1000
 * //   Total Time: 153.42ms
 * //   Average Time: 0.153ms
 * //   Min Time: 0.120ms
 * //   Max Time: 0.180ms
 * //   Operations/sec: 6548
 */
export function formatBenchmarkResult(result: BenchmarkResult): string {
  return `
${result.name}:
  Iterations: ${result.iterations}
  Total Time: ${result.totalTime.toFixed(2)}ms
  Average Time: ${result.averageTime.toFixed(3)}ms
  Min Time: ${result.minTime.toFixed(3)}ms
  Max Time: ${result.maxTime.toFixed(3)}ms
  Operations/sec: ${result.operationsPerSecond.toFixed(0)}
`.trim();
}
