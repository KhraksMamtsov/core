/**
 * NonEmptyTraversable<T> describes a parameterized type T<A> that contains one or more values of type `A`.
 *
 * @since 1.0.0
 */
import type { Kind, TypeClass, TypeLambda } from "@fp-ts/core/HKT"
import { identity } from "@fp-ts/core/internal/Function"
import type { NonEmptyApplicative } from "@fp-ts/core/typeclass/NonEmptyApplicative"

/**
 * @category type class
 * @since 1.0.0
 */
export interface NonEmptyTraversable<T extends TypeLambda> extends TypeClass<T> {
  readonly nonEmptyTraverse: <F extends TypeLambda>(
    F: NonEmptyApplicative<F>
  ) => <A, R, O, E, B>(
    f: (a: A) => Kind<F, R, O, E, B>
  ) => <TR, TO, TE>(
    self: Kind<T, TR, TO, TE, A>
  ) => Kind<F, R, O, E, Kind<T, TR, TO, TE, B>>
}

/**
 * Returns a default `nonEmptyTraverse` composition.
 *
 * @since 1.0.0
 */
export const nonEmptyTraverseComposition = <T extends TypeLambda, F extends TypeLambda>(
  T: NonEmptyTraversable<T>,
  G: NonEmptyTraversable<F>
) =>
  <G extends TypeLambda>(F: NonEmptyApplicative<G>) =>
    <A, R, O, E, B>(
      f: (a: A) => Kind<G, R, O, E, B>
    ): (<TR, TO, TE, GR, GO, GE>(
      tfa: Kind<T, TR, TO, TE, Kind<F, GR, GO, GE, A>>
    ) => Kind<G, R, O, E, Kind<T, TR, TO, TE, Kind<F, GR, GO, GE, B>>>) =>
      T.nonEmptyTraverse(F)(G.nonEmptyTraverse(F)(f))

/**
 * @since 1.0.0
 */
export const nonEmptySequence = <T extends TypeLambda>(T: NonEmptyTraversable<T>) =>
  <F extends TypeLambda>(
    F: NonEmptyApplicative<F>
  ): (<TR, TO, TE, R, O, E, A>(
    self: Kind<T, TR, TO, TE, Kind<F, R, O, E, A>>
  ) => Kind<F, R, O, E, Kind<T, TR, TO, TE, A>>) => T.nonEmptyTraverse(F)(identity)