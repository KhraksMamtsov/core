import { pipe } from "@fp-ts/core/internal/Function"
import * as _ from "@fp-ts/core/typeclass/Traversable"
import * as O from "../test-data/Option"
import * as RA from "../test-data/ReadonlyArray"
import * as U from "../util"

describe("Traversable", () => {
  it("traverseComposition", () => {
    const traverse = _.traverseComposition(RA.Traverse, RA.Traverse)(O.Applicative)
    U.deepStrictEqual(
      pipe([[1, 2], [3]], traverse((a) => (a > 0 ? O.some(a) : O.none))),
      O.some([[1, 2], [3]])
    )
    U.deepStrictEqual(pipe([[1, -2], [3]], traverse((a) => (a > 0 ? O.some(a) : O.none))), O.none)
  })

  it("sequence", () => {
    const sequence = _.sequence(RA.Traverse)(O.Applicative)
    U.deepStrictEqual(pipe([O.none, O.some(2)], sequence), O.none)
    U.deepStrictEqual(pipe([O.some(1), O.some(2)], sequence), O.some([1, 2]))
  })

  it("traverseTap", () => {
    const traverseTap = _.traverseTap(RA.Traverse)(O.Applicative)
    U.deepStrictEqual(
      pipe([], traverseTap(n => n > 0 ? O.some(n) : O.none)),
      O.some([])
    )
    U.deepStrictEqual(
      pipe(["a", "b", "c"], traverseTap(s => s.length > 0 ? O.some(s.length) : O.none)),
      O.some(["a", "b", "c"])
    )
    U.deepStrictEqual(
      pipe(["a", "", "c"], traverseTap(s => s.length > 0 ? O.some(s) : O.none)),
      O.none
    )
  })
})