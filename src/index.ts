/**
 * lineNo: The zero-based line value.
 * charNo: The zero-based character value.
 */
export type TextPositionTuple = [lineNo: number, charNo: number];

export class TextPositionFromOffset {
  private cachedAt = -1;
  private cachedLineNo = 0;
  private cachedCharNo = 0;
  constructor(private readonly text: string) { }

  get(offset: number): TextPositionTuple {
    if (offset > this.text.length)
      offset = this.text.length;

    if (this.cachedAt >= 0) {
      if (offset === this.cachedAt)
        return [this.cachedLineNo, this.cachedCharNo];
      if (offset > this.cachedAt) {
        const [addLineNo, newCharNo] = getRelativePositionFromOffset(this.text, this.cachedAt, offset);
        this.cachedLineNo += addLineNo;
        this.cachedCharNo = addLineNo > 0 ? newCharNo : (this.cachedCharNo + newCharNo);
        this.cachedAt = offset;
        return [this.cachedLineNo, this.cachedCharNo];
      }
    }

    const [lineNo, charNo] = getRelativePositionFromOffset(this.text, 0, offset);
    this.cachedLineNo = lineNo;
    this.cachedCharNo = charNo
    this.cachedAt = offset;
    return [lineNo, charNo];
  }
}

export function getRelativePositionFromOffset(text: string, baseOffset: number, offset: number): TextPositionTuple {
  const max = text.length;
  if (baseOffset > max) {
    baseOffset = max;
    offset = max;
  } else if (offset > max) {
    offset = max;
  }

  if (baseOffset < 0) baseOffset = 0;
  if (offset < 0) offset = 0;
  if (baseOffset > offset) {
    const t = offset;
    offset = baseOffset;
    baseOffset = t;
  }

  let lineNo = 0;
  let next: number;
  while ((next = text.indexOf('\n', baseOffset)) >= 0) {
    if (next >= offset) break;
    baseOffset = next + 1;
    lineNo++;
  }
  const charNo = offset - baseOffset;
  return [lineNo, charNo];
}

export type GetOffsetFromExpressionOptions = {
  /** @default 1 */
  tab?: number;
  /** @default true */
  sameLine?: boolean;
}

/**
 * Example expression:
 * - "1,2", "1;2", "1:2", "Ln 1, Col 2"
 * - "2^", "Ln 2^"
 * - "2$", "Ln 2$"
 * - "3^^", "Ln 3^^" (the first character of the line exclude the whitespace characters)
 */
export function getOffsetFromExpression(
  text: string,
  expression: string,
  options?: GetOffsetFromExpressionOptions
) {
  const fnName = 'getOffsetFromExpression';
  const parts = expression.split(/[,;:]/).map(it => it.trim());
  if (parts.length > 2) throw new Error(`Invalid expression for ${fnName}`);

  let match = parts[0].match(/^(?:ln?)?\s*(\d+)\s*(\^\^?|\$)?$/i);
  if (!match) throw new Error(`Invalid line expression for ${fnName}`);

  let lineNo = parseInt(match[1], 10);
  if (isNaN(lineNo) || lineNo < 1) lineNo = 1;

  const isBeginning = match[2] === '^';
  const isFirstChar = match[2] === '^^';
  const isEnd = match[2] === '$';
  let charNo: number;
  if (match[2]) {
    if (parts[1]) throw new Error(`Redundant character number for ${fnName}`);
  } else {
    match = parts[1].match(/^(?:c(?:ol)?)?\s*(\d+)$/i);
    if (!match) throw new Error(`Invalid character expression for ${fnName}`);

    charNo = parseInt(match[1], 10);
    if (isNaN(charNo) || charNo < 1) charNo = 1;
  }

  let offset = 0;
  while (--lineNo > 0) {
    const nextIndex = text.indexOf("\n", offset);
    if (nextIndex < 0) break; // final line
    offset = nextIndex + 1;
  }

  if (isBeginning)
    return offset;

  let tab = options && options.tab;
  if (typeof tab !== 'number' || tab < 1) tab = 1;
  else tab = Math.floor(tab);

  const max = text.length;
  if (isFirstChar) {
    while (offset < max && /^\s$/.test(text[offset])) {
      if (text[offset] === '\r' || text[offset] === '\n')
        break;
      offset++;
    }
    return offset;
  }

  if (isEnd) {
    while (offset < max && /^[\r\n]$/.test(text[offset]) === false)
      offset++;
    return offset;
  }

  let sameLine = true;
  if (options && options.sameLine === false) sameLine = false;

  // one-based to zero-based
  charNo--;
  if (sameLine) {
    while (offset < max && charNo > 0 && /^[\r\n]$/.test(text[offset]) === false) {
      charNo -= text[offset] === '\t' ? tab : 1;
      offset++;
    }
  } else {
    while (offset < max && charNo > 0) {
      charNo -= text[offset] === '\t' ? tab : 1;
      offset++;
    }
  }
  return offset;
}
