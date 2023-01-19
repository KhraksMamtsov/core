/**
 * `Semigroup<A>` describes a way of combining two values of type `A` that is associative.
 *
 * ```ts
 * export interface Semigroup<A> {
 *    combine: (that: A) => (self: A) => A
 *    combineMany: (collection: Iterable<A>) => (self: A) => A
 * }
 * ```
 *
 * The combine operator must be associative, meaning that if we combine `a` with `b` and then combine the result
 * with `c` we must get the same value as if we combine `b` with `c` and then combine `a` with the result.
 *
 * ```
 * (a <> b) <> c === a <> (b <> c)
 * ```
 *
 * The `Semigroup` abstraction allows us to combine values of a data type to build a new value of that data type
 * with richer structure.
 *
 * @since 1.0.0
 */
import type { TypeLambda } from "@fp-ts/core/HKT"
import type * as invariant from "@fp-ts/core/typeclass/Invariant"
import type { Order } from "@fp-ts/core/typeclass/Order"
import type * as product from "@fp-ts/core/typeclass/Product"
import type * as semiProduct from "@fp-ts/core/typeclass/SemiProduct"

/**
 * @category type class
 * @since 1.0.0
 */
export interface Semigroup<A> {
  readonly combine: (that: A) => (self: A) => A
  readonly combineMany: (collection: Iterable<A>) => (self: A) => A
}

/**
 * @category type lambdas
 * @since 1.0.0
 */
export interface SemigroupTypeLambda extends TypeLambda {
  readonly type: Semigroup<this["Target"]>
}

/**
 * Useful when `combineMany` can't be optimised.
 *
 * @category constructors
 * @since 1.0.0
 */
export const fromCombine = <A>(combine: Semigroup<A>["combine"]): Semigroup<A> => ({
  combine,
  combineMany: (collection) =>
    (self) => {
      let out: A = self
      for (const a of collection) {
        out = combine(a)(out)
      }
      return out
    }
})

/**
 * @category instances
 * @since 1.0.0
 */
export const string: Semigroup<string> = fromCombine((that: string) =>
  (self: string): string => self + that
)

/**
 * `number` semigroup under addition.
 *
 * @category instances
 * @since 1.0.0
 */
export const numberSum: Semigroup<number> = fromCombine((that: number) =>
  (self: number): number => self + that
)

/**
 * `number` semigroup under multiplication.
 *
 * @category instances
 * @since 1.0.0
 */
export const numberMultiply: Semigroup<number> = {
  combine: (that: number) => (self: number): number => self * that,
  combineMany: (collection) =>
    (self) => {
      if (self === 0) {
        return 0
      }
      let out = self
      for (const n of collection) {
        if (n === 0) {
          return 0
        }
        out = out * n
      }
      return out
    }
}

/**
 * This function creates and returns a new `Semigroup` for a tuple of values based on the given `Semigroup`s for each element in the tuple.
 * The returned `Semigroup` combines two tuples of the same type by applying the corresponding `Semigroup` passed as arguments to each element in the tuple.
 * It is useful when you need to combine two tuples of the same type and you have a specific way of combining each element of the tuple.
 *
 * @category combinators
 * @since 1.0.0
 */
export const tuple = <A extends ReadonlyArray<any>>(
  ...semigroups: { readonly [K in keyof A]: Semigroup<A[K]> }
): Semigroup<A> =>
  fromCombine((that) => (self) => semigroups.map((S, i) => S.combine(that[i])(self[i])) as any)

/**
 * Given a type `A`, this function creates and returns a `Semigroup` for `Array<A>`.
 * The returned `Semigroup` combines two arrays by concatenating them.
 *
 * @category combinators
 * @since 1.0.0
 */
export const array = <A>(): Semigroup<Array<A>> => fromCombine(that => self => self.concat(that))

/**
 * Given a type `A`, this function creates and returns a `Semigroup` for `ReadonlyArray<A>`.
 * The returned `Semigroup` combines two arrays by concatenating them.
 *
 * @category combinators
 * @since 1.0.0
 */
export const readonlyArray: <A>() => Semigroup<ReadonlyArray<A>> = array as any

/**
 * This function creates and returns a new `Semigroup` for a struct of values based on the given `Semigroup`s for each property in the struct.
 * The returned `Semigroup` combines two structs of the same type by applying the corresponding `Semigroup` passed as arguments to each property in the struct.
 * It is useful when you need to combine two structs of the same type and you have a specific way of combining each property of the struct.
 *
 * @category combinators
 * @since 1.0.0
 */
export const struct = <A>(semigroups: { readonly [K in keyof A]: Semigroup<A[K]> }): Semigroup<
  { readonly [K in keyof A]: A[K] }
> =>
  fromCombine((that) =>
    (self) => {
      const r = {} as any
      for (const k in semigroups) {
        if (Object.prototype.hasOwnProperty.call(semigroups, k)) {
          r[k] = semigroups[k].combine(that[k])(self[k])
        }
      }
      return r
    }
  )

/**
 * `Semigroup` that returns last minimum of elements.
 *
 * @category constructors
 * @since 1.0.0
 */
export const min = <A>(O: Order<A>): Semigroup<A> =>
  fromCombine((that) => (self) => O.compare(that)(self) === -1 ? self : that)

/**
 * `Semigroup` that returns last maximum of elements.
 *
 * @category constructors
 * @since 1.0.0
 */
export const max = <A>(O: Order<A>): Semigroup<A> =>
  fromCombine((that) => (self) => O.compare(that)(self) === 1 ? self : that)

/**
 * @category constructors
 * @since 1.0.0
 */
export const constant = <A>(a: A): Semigroup<A> => ({
  combine: () => () => a,
  combineMany: () => () => a
})

/**
 * The dual of a `Semigroup`, obtained by flipping the arguments of `combine`.
 *
 * @since 1.0.0
 */
export const reverse = <A>(S: Semigroup<A>): Semigroup<A> => ({
  combine: (that) => (self) => S.combine(self)(that),
  combineMany: (collection) =>
    (self) => {
      const reversed = Array.from(collection).reverse()
      return reversed.length > 0 ?
        S.combine(self)(S.combineMany(reversed.slice(1))(reversed[0])) :
        self
    }
})

/**
 * @since 1.0.0
 */
export const intercalate = <A>(separator: A) =>
  (S: Semigroup<A>): Semigroup<A> =>
    fromCombine(
      (that) => S.combineMany([separator, that])
    )

/**
 * Always return the first argument.
 *
 * @category instances
 * @since 1.0.0
 */
export const first = <A = never>(): Semigroup<A> => ({
  combine: () => a => a,
  combineMany: () => a => a
})

/**
 * Always return the last argument.
 *
 * @category instances
 * @since 1.0.0
 */
export const last = <A = never>(): Semigroup<A> => ({
  combine: second => () => second,
  combineMany: collection =>
    self => {
      let a: A = self
      // eslint-disable-next-line no-empty
      for (a of collection) {}
      return a
    }
})

/**
 * @since 1.0.0
 */
export const imap = <A, B>(
  to: (a: A) => B,
  from: (b: B) => A
) =>
  (S: Semigroup<A>): Semigroup<B> => ({
    combine: that => self => to(S.combine(from(that))(from(self))),
    combineMany: (collection) =>
      self =>
        to(
          S.combineMany(
            (Array.isArray(collection) ? collection : Array.from(collection)).map(from)
          )(from(self))
        )
  })

/**
 * @category instances
 * @since 1.0.0
 */
export const Invariant: invariant.Invariant<SemigroupTypeLambda> = {
  imap
}

/**
 * @category instances
 * @since 1.0.0
 */
export const SemiProduct: semiProduct.SemiProduct<SemigroupTypeLambda> = {
  ...Invariant,
  product: that => self => tuple(self, that),
  productMany: collection => self => tuple(self, ...collection)
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Product: product.Product<SemigroupTypeLambda> = {
  ...SemiProduct,
  of: constant,
  productAll: <A>(collection: Iterable<Semigroup<A>>) => tuple<Array<A>>(...collection)
}
