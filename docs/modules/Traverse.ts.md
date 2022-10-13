---
title: Traverse.ts
nav_order: 30
parent: Modules
---

## Traverse overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [model](#model)
  - [Traverse (interface)](#traverse-interface)
- [utils](#utils)
  - [sequence](#sequence)
  - [traverseComposition](#traversecomposition)

---

# model

## Traverse (interface)

**Signature**

```ts
export interface Traverse<T extends TypeLambda> extends TypeClass<T> {
  readonly traverse: <F extends TypeLambda>(
    Applicative: Applicative<F>
  ) => <A, S, R, O, E, B>(
    f: (a: A) => Kind<F, S, R, O, E, B>
  ) => <TS, TR, TO, TE>(self: Kind<T, TS, TR, TO, TE, A>) => Kind<F, S, R, O, E, Kind<T, TS, TR, TO, TE, B>>
}
```

Added in v3.0.0

# utils

## sequence

**Signature**

```ts
export declare const sequence: <T extends any>(
  Traversable: Traverse<T>
) => <F extends any>(G: any) => <TS, TR, TO, TE, S, R, O, E, A>(self: any) => any
```

Added in v3.0.0

## traverseComposition

Returns a default `traverse` composition.

**Signature**

```ts
export declare const traverseComposition: <F extends any, G extends any>(
  TraversableF: Traverse<F>,
  TraversableG: Traverse<G>
) => <H extends any>(
  H: any
) => <A, S, R, O, E, B>(f: (a: A) => any) => <FS, FR, FO, FE, GS, GR, GO, GE>(fga: any) => any
```

Added in v3.0.0