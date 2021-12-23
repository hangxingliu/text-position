/**
 * lineNo: The zero-based line value.
 * charNo: The zero-based character value.
 */
export declare type TextPositionTuple = [lineNo: number, charNo: number];
export declare class TextPositionFromOffset {
    private readonly text;
    private cachedAt;
    private cachedLineNo;
    private cachedCharNo;
    constructor(text: string);
    get(offset: number): TextPositionTuple;
}
export declare function getRelativePositionFromOffset(text: string, baseOffset: number, offset: number): TextPositionTuple;
export declare type GetOffsetFromExpressionOptions = {
    /** @default 1 */
    tab?: number;
    /** @default true */
    sameLine?: boolean;
};
/**
 * Example expression:
 * - "1,2", "1;2", "1:2", "Ln 1, Col 2"
 * - "2^", "Ln 2^"
 * - "2$", "Ln 2$"
 * - "3^^", "Ln 3^^" (the first character of the line exclude the whitespace characters)
 */
export declare function getOffsetFromExpression(text: string, expression: string, options?: GetOffsetFromExpressionOptions): number;
