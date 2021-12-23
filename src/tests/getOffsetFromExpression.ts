import { readFileSync } from "fs";
import { basename, resolve as resolvePath } from "path";
import { deepStrictEqual as eq } from "assert";

import { getOffsetFromExpression, GetOffsetFromExpressionOptions } from "..";

console.log(`testing "${basename(__filename)}" ...`);

let txt: string;
test1();
test2();

function test1() {
  txt = readFileSync(resolvePath(__dirname, '../../src/tests/APACHE-2.0.txt'), 'utf8');

  test('1^', {}, 0, '  ');
  test('1^^', {}, 33, 'Ap');
  test('Ln 1, Col 34', {}, 33, 'Ap');
  test('1$', {}, 47, '\n ');

  test('5,64', {}, 221, '\n\n');
  test('6,Col 1', {}, 222, '\n ');
  test('6^', {}, 222, '\n ');
  test('6^^', {}, 222, '\n ');
  test('6$', {}, 222, '\n ');

  test('7,19', {}, 241, '\n\n');
  test('7,20', {}, 241, '\n\n');
  test('7,20', { sameLine: false }, 242, '\n ');
  test('7,21', { sameLine: false }, 243, '  ');

  test('202,1', {}, 11357, '');
  test('202,2', {}, 11357, '');
  test('203,1', {}, 11357, '');
  test('203^', {}, 11357, '');
  test('203^^', {}, 11357, '');


}
function test2() {
  const lines = [
    '#include<stdio.h>', // L1
    '', // L2
    'int main(void) {', // L3
    '\tprintf("HelloWorld!\\n");', //L4
    '\treturn 0;', // L5
    '}', // L6
    '', // L7
  ];
  txt = lines.join('\r\n');

  test('1^', {}, 0, '#i');
  test('1^^', {}, 0, '#i');
  test('1,1', {}, 0, '#i');
  test('1,0', {}, 0, '#i');
  test('1$', {}, 17, '\r\n');
  test('1,18', {}, 17, '\r\n');
  test('1,20', {}, 17, '\r\n');
  test('1,20', { sameLine: false }, 19, '\r\n');

  test('2,1', {}, 19, '\r\n');
  test('4,1', {}, 39, '\tp');
  test('4^', {}, 39, '\tp');
  test('4^^', {}, 40, 'pr');
  test('4,2', {}, 40, 'pr');
  test('4,5', { tab: 4 }, 40, 'pr');
  test('4,4', { tab: 4 }, 40, 'pr');
  test('4,3', { tab: 4 }, 40, 'pr');
  test('4,2', { tab: 4 }, 40, 'pr');
  test('4,1', { tab: 4 }, 39, '\tp');

  test('7,1', {}, 81, '');
  test('7,2', {}, 81, '');
  test('7$', {}, 81, '');
}

function test(expression: string, options: GetOffsetFromExpressionOptions, offset: number, twoChars: string) {
  const actual = getOffsetFromExpression(txt, expression, options)
  eq(actual, offset, `expression=${JSON.stringify(expression)}, actual=${actual}, expected=${offset}`);

  const subText = txt.slice(actual, actual + 2);
  eq(subText, twoChars, `expression=${JSON.stringify(expression)}, offset=${offset} actual=${JSON.stringify(subText)}, expected=${JSON.stringify(twoChars)}`);
}
