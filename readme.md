# flattie [![CI](https://github.com/lukeed/flattie/workflows/CI/badge.svg)](https://github.com/lukeed/flattie/actions) [![codecov](https://badgen.now.sh/codecov/c/github/lukeed/flattie)](https://codecov.io/gh/lukeed/flattie)

> A tiny (203B) and [fast](#benchmarks) utility to flatten an object with customizable glue

This module recursively squashes an Object/Array. The output is a flat object – AKA, it has a single level of depth.

By default, the `.` character is used to glue/join layers' keys together. This is customizable.

Finally, by default, any keys with nullish values (`null` and `undefined`) are **not** included in the return object.

## Install

```
$ npm install --save flattie
```


## Usage

```js
import { flattie } from 'flattie';

flattie({
  a: 'hi',
  b: {
    a: null,
    b: ['foo', '', null, 'bar'],
    d: 'hello',
    e: {
      a: 'yo',
      b: undefined,
      c: 'sup',
      d: 0,
      f: [
        { foo: 123, bar: 123 },
        { foo: 465, bar: 456 },
      ]
    }
  },
  c: 'world'
});
// {
//   'a': 'hi',
//   'b.b.0': 'foo',
//   'b.b.1': '',
//   'b.b.3': 'bar',
//   'b.d': 'hello',
//   'b.e.a': 'yo',
//   'b.e.c': 'sup',
//   'b.e.d': 0,
//   'b.e.f.0.foo': 123,
//   'b.e.f.0.bar': 123,
//   'b.e.f.1.foo': 465,
//   'b.e.f.1.bar': 456,
//   'c': 'world'
// }
```

> **Note:** `null` and `undefined` values are purged by default.

## API

### flattie(input, glue?, keepNullish?)
Returns: `Object`

Returns a new object with a single level of depth.

> **Important:** An object is always returned despite `input` type.

#### input
Type: `Object|Array`

The object to flatten.

#### glue
Type: `String`<br>
Default: `.`

A string used to join parent key names to nested child key names.

```js
const foo = { bar: 123 };

flattie({ foo }); //=> { 'foo.bar': 123 }
flattie({ foo }, '???'); //=> { 'foo???bar': 123 }
```

#### keepNullish
Type: `Boolean`<br>
Default: `false`

Whether or not `null` and `undefined` values should be kept.

```js
// Note: Applies to Objects too
const foo = ['hello', null, NaN, undefined, /*hole*/, 'world'];

flattie({ foo });
//=> {
//=>   'foo.0': 'hello',
//=>   'foo.2': NaN,
//=>   'foo.5': 'world'
//=> }

flattie({ foo }, '.', true);
//=> {
//=>   'foo.0': 'hello',
//=>   'foo.1': null,
//=>   'foo.2': NaN,
//=>   'foo.3': undefined,
//=>   'foo.4': undefined,
//=>   'foo.5': 'world'
//=> }
```

## Benchmarks

> Running on Node.js v10.13.0

```
Load Time:
  flat             1.047ms
  flatten-object   1.239ms
  flat-obj         0.997ms
  flattie          0.258ms

Validation:
  ✔ flat
  ✔ flatten-object
  ✔ flat-obj
  ✔ flattie

Benchmark:
  flat               x 186,487 ops/sec ±1.28% (86 runs sampled)
  flatten-object     x 199,476 ops/sec ±1.01% (93 runs sampled)
  flat-obj           x 393,574 ops/sec ±1.41% (95 runs sampled)
  flattie            x 909,734 ops/sec ±0.82% (93 runs sampled)
```


## Related

* [nestie](https://github.com/lukeed/nestie) – A tiny (242B) and fast utility to expand a flattened object <br>_This is `flattie`'s reverse / counterpart._


## License

MIT © [Luke Edwards](https://lukeed.com)

## 中文说明

`flattie(input, glue?, keepNullish?)` 会递归地把 plain object 与 Array 压成单层对象，并返回一个全新对象（不修改输入）。

- **glue（分隔符）**：默认 `'.'`。顶层键不带任何前导分隔符（如 `aaa`），仅在已有前缀时才拼接 `前缀 + glue + 键`。自定义值（如 `'FOO'`、`'~'`）会贯穿所有嵌套层级，数组下标同理（如 `bFOO0FOOa`）。
- **数组下标**：从 `0` 开始，例如 `0.0`、`1.2.3`，不会整体偏移。
- **nullish 极性**：默认（`keepNullish` 为假）忽略 `null` 与 `undefined`；显式传入第三个参数为真（如 `flattie(input, '.', true)`）时才保留它们，包括稀疏数组的空洞（空洞按索引写为 `undefined`）。
- **非 nullish 值**：空串 `''`、`0`、`NaN` 都不是 nullish，默认也会保留。
- **非 object 输入**：`null`、`undefined`、数字、字符串等一律返回 `{}`。
