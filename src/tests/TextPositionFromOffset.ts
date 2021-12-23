import { basename } from "path";
import { deepStrictEqual as eq } from "assert";
import { TextPositionFromOffset, getRelativePositionFromOffset } from "..";

console.log(`testing "${basename(__filename)}" ...`);

const text = 'abcdef\njuhs\n\nhuj';
eq(getRelativePositionFromOffset(text, 0, 0), [0, 0]);
eq(getRelativePositionFromOffset(text, 0, 2), [0, 2]);
eq(getRelativePositionFromOffset(text, 0, 6), [0, 6]);
eq(getRelativePositionFromOffset(text, 0, 7), [1, 0]);
eq(getRelativePositionFromOffset(text, 1, 7), [1, 0]);
eq(getRelativePositionFromOffset(text, 1, 8), [1, 1]);
eq(getRelativePositionFromOffset(text, 1, 11), [1, 4]);
eq(getRelativePositionFromOffset(text, 1, 12), [2, 0]);
eq(getRelativePositionFromOffset(text, 1, 13), [3, 0]);
eq(getRelativePositionFromOffset(text, 1, 14), [3, 1]);
eq(getRelativePositionFromOffset(text, 1, 15), [3, 2]);
eq(getRelativePositionFromOffset(text, 1, 16), [3, 3]);
eq(getRelativePositionFromOffset(text, 1, 17), [3, 3]);
eq(getRelativePositionFromOffset(text, 1, 18), [3, 3]);

eq(getRelativePositionFromOffset(text, 6, 7), [1, 0]);
eq(getRelativePositionFromOffset(text, 7, 7), [0, 0]);
eq(getRelativePositionFromOffset(text, 7, 7), [0, 0]);

eq(getRelativePositionFromOffset(text, 12, 17), [1, 3]);

eq(getRelativePositionFromOffset(text, 20, 18), [0, 0]);
eq(getRelativePositionFromOffset(text, -1, 18), [3, 3]);
eq(getRelativePositionFromOffset(text, -1, -99), [0, 0]);

const text2 = 'abcdef\n he\nw\r\n\nhuj';
const pos = new TextPositionFromOffset(text2);
eq(pos.get(0), [0, 0]);
eq(pos.get(1), [0, 1]);
eq(pos.get(2), [0, 2]);
eq(pos.get(3), [0, 3]);
eq(pos.get(4), [0, 4]);
eq(pos.get(5), [0, 5]);
eq(pos.get(6), [0, 6]);
eq(pos.get(7), [1, 0]);
eq(pos.get(8), [1, 1]);
eq(pos.get(9), [1, 2]);
eq(pos.get(10), [1, 3]);
eq(pos.get(11), [2, 0]);
eq(pos.get(12), [2, 1]);
eq(pos.get(13), [2, 2]);
eq(pos.get(14), [3, 0]);
eq(pos.get(15), [4, 0]);
eq(pos.get(16), [4, 1]);
eq(pos.get(17), [4, 2]);
eq(pos.get(18), [4, 3]);
eq(pos.get(19), [4, 3]);

eq(pos.get(1), [0, 1]);
eq(pos.get(12), [2, 1]);
eq(pos.get(14), [3, 0]);
eq(pos.get(14), [3, 0]);

const pos2 = new TextPositionFromOffset('');
for (let i = -100; i < 100; i++)
  eq(pos2.get(i), [0, 0]);
