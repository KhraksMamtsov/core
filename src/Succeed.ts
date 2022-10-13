/**
 * @since 3.0.0
 */
import type { Kind, TypeClass, TypeLambda } from "@fp-ts/core/HKT"
import type { KleisliCategory } from "@fp-ts/core/KleisliCategory"

/**
 * @category model
 * @since 3.0.0
 */
export interface Succeed<F extends TypeLambda> extends TypeClass<F> {
  readonly succeed: <A, S>(a: A) => Kind<F, S, unknown, never, never, A>
}

/**
 * @since 3.0.0
 */
export const idKleisli = <F extends TypeLambda>(
  Succeed: Succeed<F>
): KleisliCategory<F>["idKleisli"] => () => Succeed.succeed