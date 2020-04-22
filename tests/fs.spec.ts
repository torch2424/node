/**
 * This is the fs test suite. For each prototype function, put a single test
 * function call here.
 *
 * @example
 * describe("fs", () => {
 *   test("#openSync", () => {
 *     // put any expectations related to #openSync here
 *   });
 * });
 */

import {openSync} from "fs"

describe("fs", () => {
  test("#openSync", () => {
    let descriptor = openSync("README.md");
    // TODO: Write support for console log haha!
  });
});
