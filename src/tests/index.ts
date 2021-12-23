import { readdirSync } from "fs";
import { resolve as resolvePath } from "path";

const tests = readdirSync(__dirname, { withFileTypes: true }).filter(it => it.name.endsWith('.js') && it.isFile())
for (let i = 0; i < tests.length; i++) {
  const testName = tests[i].name;
  const testFile = resolvePath(__dirname, testName);
  require(testFile);
}
