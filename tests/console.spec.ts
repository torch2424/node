/**
 * This is the console test suite. For each prototype function, put a single test
 * function call here.
 *
 * @example
 * describe("console", () => {
 *   test("#log", () => {
 *     // put any expectations related to #log here
 *   });
 * });
 */

describe("console", () => {
  test("#log", () => {
    console.log("I should be logged!");
    expect(true).toBe(true);
  });
});
