/**
 * The `FromEither` type class represents those data types which support errors.
 *
 * @since 3.0.0
 */

import * as E from './Either'
import { flow, Lazy, Predicate, Refinement } from './function'
import { HKT2, Kind2, Kind3, Kind4, URIS2, URIS3, URIS4 } from './HKT'
import { Option } from './Option'

import Either = E.Either

/**
 * @category type classes
 * @since 3.0.0
 */
export interface FromEither<F> {
  readonly URI: F
  readonly fromEither: <E, A>(e: Either<E, A>) => HKT2<F, E, A>
}

/**
 * @category type classes
 * @since 3.0.0
 */
export interface FromEither2<F extends URIS2> {
  readonly URI: F
  readonly fromEither: <E, A>(e: Either<E, A>) => Kind2<F, E, A>
}

/**
 * @category type classes
 * @since 3.0.0
 */
export interface FromEither2C<F extends URIS2, E> {
  readonly URI: F
  readonly fromEither: <A>(e: Either<E, A>) => Kind2<F, E, A>
}

/**
 * @category type classes
 * @since 3.0.0
 */
export interface FromEither3<F extends URIS3> {
  readonly URI: F
  readonly fromEither: <E, A, R>(e: Either<E, A>) => Kind3<F, R, E, A>
}

/**
 * @category type classes
 * @since 3.0.0
 */
export interface FromEither3C<F extends URIS3, E> {
  readonly URI: F
  readonly fromEither: <A, R>(e: Either<E, A>) => Kind3<F, R, E, A>
}

/**
 * @category type classes
 * @since 3.0.0
 */
export interface FromEither4<F extends URIS4> {
  readonly URI: F
  readonly fromEither: <E, A, S, R>(e: Either<E, A>) => Kind4<F, S, R, E, A>
}

/**
 * @since 3.0.0
 */
export function fromOption_<F extends URIS4>(
  F: FromEither4<F>
): <E>(onNone: Lazy<E>) => <A, S, R>(ma: Option<A>) => Kind4<F, S, R, E, A>
export function fromOption_<F extends URIS3>(
  F: FromEither3<F>
): <E>(onNone: Lazy<E>) => <A, R>(ma: Option<A>) => Kind3<F, R, E, A>
export function fromOption_<F extends URIS3, E>(
  F: FromEither3C<F, E>
): (onNone: Lazy<E>) => <A, R>(ma: Option<A>) => Kind3<F, R, E, A>
export function fromOption_<F extends URIS2>(
  F: FromEither2<F>
): <E>(onNone: Lazy<E>) => <A>(ma: Option<A>) => Kind2<F, E, A>
export function fromOption_<F extends URIS2, E>(
  F: FromEither2C<F, E>
): (onNone: Lazy<E>) => <A>(ma: Option<A>) => Kind2<F, E, A>
export function fromOption_<F>(F: FromEither<F>): <E>(onNone: Lazy<E>) => <A>(ma: Option<A>) => HKT2<F, E, A>
export function fromOption_<F>(F: FromEither<F>): <E>(onNone: Lazy<E>) => <A>(ma: Option<A>) => HKT2<F, E, A> {
  return (onNone) => flow(E.fromOption(onNone), F.fromEither)
}

/**
 * @since 3.0.0
 */
export function fromPredicate_<F extends URIS4>(
  F: FromEither4<F>
): {
  <A, B extends A, E>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <S, R>(a: A) => Kind4<F, S, R, E, B>
  <A, E>(predicate: Predicate<A>, onFalse: (a: A) => E): <S, R>(a: A) => Kind4<F, S, R, E, A>
}
export function fromPredicate_<F extends URIS3>(
  F: FromEither3<F>
): {
  <A, B extends A, E>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <R>(a: A) => Kind3<F, R, E, B>
  <A, E>(predicate: Predicate<A>, onFalse: (a: A) => E): <R>(a: A) => Kind3<F, R, E, A>
}
export function fromPredicate_<F extends URIS2>(
  F: FromEither2<F>
): {
  <A, B extends A, E>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (a: A) => Kind2<F, E, B>
  <A, E>(predicate: Predicate<A>, onFalse: (a: A) => E): (a: A) => Kind2<F, E, A>
}
export function fromPredicate_<F>(
  F: FromEither<F>
): {
  <A, B extends A, E>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (a: A) => HKT2<F, E, B>
  <A, E>(predicate: Predicate<A>, onFalse: (a: A) => E): (a: A) => HKT2<F, E, A>
}
export function fromPredicate_<F>(
  F: FromEither<F>
): {
  <A, B extends A, E>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (a: A) => HKT2<F, E, B>
  <A, E>(predicate: Predicate<A>, onFalse: (a: A) => E): (a: A) => HKT2<F, E, A>
} {
  return <A, E>(predicate: Predicate<A>, onFalse: (a: A) => E) =>
    flow(E.fromPredicate(predicate, onFalse), F.fromEither)
}