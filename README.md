# Text Position Utils

``` bash
npm install @hangxingliu/text-position
# or
yarn add @hangxingliu/text-position
```

## APIs

- `TextPositionFromOffset`
- `getRelativePositionFromOffset`
- `getOffsetFromExpression`

## Examples

``` javascript
const { getOffsetFromExpression, TextPositionFromOffset } = require('@hangxingliu/text-position')
const text = 'abc\n\tdef';

getOffsetFromExpression(text, '1,2'); // 1
getOffsetFromExpression(text, '1$'); // 3
getOffsetFromExpression(text, '2^'); // 4
getOffsetFromExpression(text, '2^^'); // 5
getOffsetFromExpression(text, '2,2'); // 5
getOffsetFromExpression(text, '2,4', { tab: 4 }); // 5
getOffsetFromExpression(text, 'Ln 1, Col 2'); // 1

const pos = new TextPositionFromOffset(text)
pos.get(5); // [1, 1]
pos.get(6); // [1, 2]
pos.get(100); // [1, 4]
```

@see [tests](./src/tests/getOffsetFromExpression.ts)
