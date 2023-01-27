---
title: String.ts
nav_order: 14
parent: Modules
---

## String overview

This module provides utility functions and type class instances for working with the `string` type in TypeScript.
It includes functions for basic string manipulation, as well as type class instances for
`Equivalence`, `Order`, `Semigroup`, and `Monoid`.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [guards](#guards)
  - [isString](#isstring)
- [instances](#instances)
  - [Equivalence](#equivalence)
  - [Monoid](#monoid)
  - [Order](#order)
  - [Semigroup](#semigroup)
- [utils](#utils)
  - [concat](#concat)
  - [empty](#empty)
  - [endsWith](#endswith)
  - [includes](#includes)
  - [isEmpty](#isempty)
  - [isNonEmpty](#isnonempty)
  - [length](#length)
  - [replace](#replace)
  - [slice](#slice)
  - [split](#split)
  - [startsWith](#startswith)
  - [takeLeft](#takeleft)
  - [takeRight](#takeright)
  - [toLowerCase](#tolowercase)
  - [toUpperCase](#touppercase)
  - [trim](#trim)
  - [trimEnd](#trimend)
  - [trimStart](#trimstart)

---

# guards

## isString

**Signature**

```ts
export declare const isString: any
```

Added in v1.0.0

# instances

## Equivalence

**Signature**

```ts
export declare const Equivalence: any
```

Added in v1.0.0

## Monoid

`string` monoid under concatenation.

The `empty` value is `''`.

**Signature**

```ts
export declare const Monoid: any
```

Added in v1.0.0

## Order

**Signature**

```ts
export declare const Order: any
```

Added in v1.0.0

## Semigroup

`string` semigroup under concatenation.

**Signature**

```ts
export declare const Semigroup: any
```

Added in v1.0.0

# utils

## concat

**Signature**

```ts
export declare const concat: (that: string) => (self: string) => string
```

Added in v1.0.0

## empty

**Signature**

```ts
export declare const empty: ''
```

Added in v1.0.0

## endsWith

**Signature**

```ts
export declare const endsWith: (searchString: string, position?: number | undefined) => (s: string) => boolean
```

**Example**

```ts
import * as S from '@fp-ts/core/String'
import { pipe } from '@fp-ts/core/Function'

assert.deepStrictEqual(pipe('abc', S.endsWith('c')), true)
assert.deepStrictEqual(pipe('ab', S.endsWith('c')), false)
```

Added in v1.0.0

## includes

**Signature**

```ts
export declare const includes: (searchString: string, position?: number | undefined) => (s: string) => boolean
```

**Example**

```ts
import * as S from '@fp-ts/core/String'
import { pipe } from '@fp-ts/core/Function'

assert.deepStrictEqual(pipe('abc', S.includes('b')), true)
assert.deepStrictEqual(pipe('abc', S.includes('d')), false)
```

Added in v1.0.0

## isEmpty

Test whether a `string` is empty.

**Signature**

```ts
export declare const isEmpty: (s: string) => s is ''
```

**Example**

```ts
import * as S from '@fp-ts/core/String'
import { pipe } from '@fp-ts/core/Function'

assert.deepStrictEqual(pipe('', S.isEmpty), true)
assert.deepStrictEqual(pipe('a', S.isEmpty), false)
```

Added in v1.0.0

## isNonEmpty

Test whether a `string` is non empty.

**Signature**

```ts
export declare const isNonEmpty: (s: string) => boolean
```

Added in v1.0.0

## length

Calculate the number of characters in a `string`.

**Signature**

```ts
export declare const length: (s: string) => number
```

**Example**

```ts
import * as S from '@fp-ts/core/String'
import { pipe } from '@fp-ts/core/Function'

assert.deepStrictEqual(pipe('abc', S.length), 3)
```

Added in v1.0.0

## replace

**Signature**

```ts
export declare const replace: (searchValue: string | RegExp, replaceValue: string) => (s: string) => string
```

**Example**

```ts
import * as S from '@fp-ts/core/String'
import { pipe } from '@fp-ts/core/Function'

assert.deepStrictEqual(pipe('abc', S.replace('b', 'd')), 'adc')
```

Added in v1.0.0

## slice

**Signature**

```ts
export declare const slice: (start: number, end: number) => (s: string) => string
```

**Example**

```ts
import * as S from '@fp-ts/core/String'
import { pipe } from '@fp-ts/core/Function'

assert.deepStrictEqual(pipe('abcd', S.slice(1, 3)), 'bc')
```

Added in v1.0.0

## split

**Signature**

```ts
export declare const split: (separator: string | RegExp) => (s: string) => any
```

**Example**

```ts
import * as S from '@fp-ts/core/String'
import { pipe } from '@fp-ts/core/Function'

assert.deepStrictEqual(pipe('abc', S.split('')), ['a', 'b', 'c'])
assert.deepStrictEqual(pipe('', S.split('')), [''])
```

Added in v1.0.0

## startsWith

**Signature**

```ts
export declare const startsWith: (searchString: string, position?: number | undefined) => (s: string) => boolean
```

**Example**

```ts
import * as S from '@fp-ts/core/String'
import { pipe } from '@fp-ts/core/Function'

assert.deepStrictEqual(pipe('abc', S.startsWith('a')), true)
assert.deepStrictEqual(pipe('bc', S.startsWith('a')), false)
```

Added in v1.0.0

## takeLeft

Keep the specified number of characters from the start of a string.

If `n` is larger than the available number of characters, the string will
be returned whole.

If `n` is not a positive number, an empty string will be returned.

If `n` is a float, it will be rounded down to the nearest integer.

**Signature**

```ts
export declare const takeLeft: (n: number) => (self: string) => string
```

Added in v1.0.0

## takeRight

Keep the specified number of characters from the end of a string.

If `n` is larger than the available number of characters, the string will
be returned whole.

If `n` is not a positive number, an empty string will be returned.

If `n` is a float, it will be rounded down to the nearest integer.

**Signature**

```ts
export declare const takeRight: (n: number) => (s: string) => string
```

Added in v1.0.0

## toLowerCase

**Signature**

```ts
export declare const toLowerCase: (s: string) => string
```

**Example**

```ts
import * as S from '@fp-ts/core/String'
import { pipe } from '@fp-ts/core/Function'

assert.deepStrictEqual(pipe('A', S.toLowerCase), 'a')
```

Added in v1.0.0

## toUpperCase

**Signature**

```ts
export declare const toUpperCase: (s: string) => string
```

**Example**

```ts
import * as S from '@fp-ts/core/String'
import { pipe } from '@fp-ts/core/Function'

assert.deepStrictEqual(pipe('a', S.toUpperCase), 'A')
```

Added in v1.0.0

## trim

**Signature**

```ts
export declare const trim: (s: string) => string
```

**Example**

```ts
import * as S from '@fp-ts/core/String'
import { pipe } from '@fp-ts/core/Function'

assert.deepStrictEqual(pipe(' a ', S.trim), 'a')
```

Added in v1.0.0

## trimEnd

**Signature**

```ts
export declare const trimEnd: (s: string) => string
```

**Example**

```ts
import * as S from '@fp-ts/core/String'
import { pipe } from '@fp-ts/core/Function'

assert.deepStrictEqual(pipe(' a ', S.trimEnd), ' a')
```

Added in v1.0.0

## trimStart

**Signature**

```ts
export declare const trimStart: (s: string) => string
```

**Example**

```ts
import * as S from '@fp-ts/core/String'
import { pipe } from '@fp-ts/core/Function'

assert.deepStrictEqual(pipe(' a ', S.trimStart), 'a ')
```

Added in v1.0.0