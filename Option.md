# The `Option` data type

The `Option` data type is a powerful and flexible tool in functional programming, it can be found in the `@fp-ts/core/Option module`. It is used to model optional values in TypeScript, by providing a container that can hold either a value of a specific type (`Some`) or no value at all (`None`). This helps in handling the presence or absence of a value in a safe and predictable way, making it easy to chain computations and handle errors in a functional way.

There are two possible interpretations of the `Option` data type:

1. as a representation of an **optional value** of type `A`
2. as a representation of the result of a **computation that can fail** or return a value of type `A`

**Optional value**

In the first of these two interpretations, the `None` union member represents the absence of the value, while the `Some<A>` union member represents the presence of the value of type `A`

**Computation that can fail**

In the second of these two interpretations, the `None` union member represents the result of a computation that has failed and therefore was not able to return any value, while the `Some<A>` union member represents the result of a computation that has succeeded and was able to return a value of type `A`.

# Definition

The `Option` data type is the union of two members: `None` and `Some`. The way chosen by the `@fp-ts/core` library to model this union in TypeScript is to use a feature of the language called [Discriminating Unions](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#discriminating-unions):

> A common technique for working with unions is to have a single field which uses literal types which you can use to let TypeScript narrow down the possible current type

By convention in `@fp-ts/core`, this single field which uses literal types is named "\_tag" (but you can use any name when defining your unions).

Furthermore, the data type `Option` is a "polymorphic" data type, that is, it makes use of a feature of TypeScript named ["Generics"](https://www.typescriptlang.org/docs/handbook/2/generics.html), meaning that the `Option` data type is a container that can hold any type.

Here's the complete definition of the `Option` type:

```ts
export type None = {
  readonly _tag: "None"; // represents the absence of a value
};

export type Some<A> = {
  readonly _tag: "Some"; // represents the presence of a value
  readonly value: A; // the actual value
};

export type Option<A> = None | Some<A>; // union type representing the option of having a value or not
```

The `Option` type is defined as a union of two other types, `None` and `Some`, that represent the two possible states of the option: having a value or not.

The type parameter `A` is used to specify the type of the value that the option holds.

The `_tag` field is used to distinguish between the two options, "None" and "Some".

# Using `Option`

To create an instance of `Option`, you can use the `some` and `none` constructors, which construct a new `Option` holding a `Some` or `None` value respectively:

```ts
import { none, some } from "@fp-ts/core/Option";

const success: Option<number> = some(1);
const failure: Option<never> = none();
```

Let's summarize the two cases in a table:

**Cheat sheet** (constructors)

| Name   | Given | To              |
| ------ | ----- | --------------- |
| `some` | `A`   | `Option<A>`     |
| `none` |       | `Option<never>` |

It is important to note that the `none` constructor by default returns a value of type `Option<never>`, this makes it possible to assign this value to any `Option<A>`, whatever the type `A` is.

```ts
const optionNumber: Option<number> = none();
const optionString: Option<string> = none();
const optionBoolean: Option<boolean> = none();
```

Alternatively, if it is useful to you, you can specify the desired type at the call site, explicitly indicating which type `A` you are interested in. This way, you don't need the type annotations:

```ts
const optionNumber = none<number>();
const optionString = none<string>();
const optionBoolean = none<boolean>();
```

In this way you don't need to specify the type of the variables `optionNumber`, `optionString`, `optionBoolean` because TypeScript infers the type from the call site.

# Modeling optional properties with `Option`

Here is an example of a `User` model where the `email` field is of type `Option<string>`. This means that the value of the `email` field may or may not be present and will be of type `string` when it is present.

```ts
interface User {
  id: number;
  username: string;
  email: Option<string>;
}
```

```ts
import { some, none } from "@fp-ts/core/Option";

// case with email
const user1: User = {
  id: 1,
  username: "john_doe",
  email: some("john.doe@example.com"),
};

// case without email
const user2: User = {
  id: 2,
  username: "jane_doe",
  email: none(),
};
```

It's important to note that the optionality only concerns the **value** of the `email` field, while the key `"email"` will always be present in the object.

# Working with `Option`

Once you have an instance of `Option`, you can use the various functions provided in the `@fp-ts/core/Option` module to work with it.

The `map` function can be used to transform the `Some` values:

```ts
import { pipe } from "@fp-ts/core/Function";
import { some, map } from "@fp-ts/core/Option";

// create a value of type Option<number> with the value of 1
const success: Option<number> = pipe(
  some(1),
  // maps the value inside the Option, adding 1, resulting in some(2)
  map((x) => x + 1)
);
```

As you can see you can transform the result of your computation without unwrapping and wrapping the underlying value of `Option`.

What is very convenient about `Option` is how the absence of value is handled (i.e. a `None`). See the example below:

```ts
const failure: Option<number> = pipe(
  none(),
  // tries to map the value inside the none, but it does not exist, resulting in none()
  map((x) => x + 1)
);
```

As you can see, even though we started with a `None` value, we can still operate on our `Option`. No errors are thrown or shown to the user, unless we do it intentionally. What happens is that when the `Option` is `None`, the mapping doesn't even happen and the `None` value representing the absence of value is returned unchanged.

# Handling failing computations

Let's see how to use the `Option` data type to model a computation that can fail, such as a function that can throw an exception based on certain conditions. Let's take the case of the following function:

```ts
function parseNumber(s: string): number {
  const n = parseFloat(s);
  if (isNaN(n)) {
    throw new Error();
  }
  return n;
}
```

An alternative to throwing an exception is to always return a value, but this value will be of type `Option<number>` instead of `number`, with the following interpretation:

- if `parseNumber` returns a `None` value, it means that the computation failed
- if the result is instead a `Some<number>` value, it means that the computation succeeded and the computed value is wrapped inside the `Some`

Let's see how we can rewrite the `parseNumber` function without throwing exceptions and using the `Option` data type instead:

```ts
import { Option, none, some } from "@fp-ts/core/Option";

function parseNumber(s: string): Option<number> {
  const n = parseFloat(s);
  return isNaN(n) ? none() : some(n);
}

console.log(parseNumber("2")); // some(2)
console.log(parseNumber("Not a number")); // none()
```

What happens if we add a call to the `parseNumber` function to a pipeline that already involves an `Option`?

```ts
const result = pipe(
  some("2"),
  map((s) => parseNumber(s)),
  map((n) => n * 2) // type-checker error!
);
```

There's something wrong, we received an error from the type checker, what happened?

The problem is that in the second `map` the parameter `n` is of type `Option<number>` and not `number`.

```ts
const result = pipe(
  some("2"),
  map((s) => parseNumber(s)),
  map((x: Option<number>) => ...)
);
```

Fortunately, the fix is simple, when adding a computation that returns an `Option` to our pipeline we should use the `flatMap` function instead of the `map` function:

```ts
import { flatMap } from "@fp-ts/core/Option";

const result = pipe(
  some("2"),
  flatMap((s) => parseNumber(s)),
  map((n) => n * 2) // ok! now `n` has type `number`
);
```

Let's summarize the two cases in a table:

**Cheat sheet** (sequencing)

| Name      | Given                         | To          |
| --------- | ----------------------------- | ----------- |
| `map`     | `Option<A>`, `A => B`         | `Option<B>` |
| `flatMap` | `Option<A>`, `A => Option<B>` | `Option<B>` |

The `flatMap` function offers the same convenience as the `map` function, which only continues with the computations contained in the pipeline if a `None` value is **not** encountered:

**Happy path, starting with a valid input**

```ts
const success: Option<number> = pipe(
  some("2"),
  flatMap((s) => parseNumber(s)), // parse the input to number
  map((x) => x * 2), // double the parsed number
  map((x) => x - 3) // subtract 3
); // some(1)
```

**Error path, starting with an invalid input**

```ts
const failure: Option<number> = pipe(
  some("a"),
  flatMap((s) => parseNumber(s)), // parse the input to number
  map((x) => x * 2), // This will not be executed because parseNumber will return None
  map((x) => x - 3) // This will not be executed
); // none()
```

**Error path, starting with None**

```ts
const noneStart: Option<number> = pipe(
  none,
  flatMap((s) => parseNumber(s)), // This will not be executed because it starts with None
  map((x) => x * 2), // This will not be executed
  map((x) => x - 3) // This will not be executed
); // none()
```

When using this approach, the **desired outcome** is always in clear view while defining your pipeline. This allows you to focus on the expected result, while leaving it to `Option` to handle any potential errors that may arise seamlessly and transparently.

You can focus on the successful scenario and let `Option` handle the tedious task of managing potential errors at every step of the pipeline, without the need for explicit handling.

# Debugging

At any time, it is possible to inspect what is happening in your pipeline using two utility functions:

**Cheat sheet** (debugging)

| Name          | Given                     | To          | Description                          |
| ------------- | ------------------------- | ----------- | ------------------------------------ |
| `inspectSome` | `Option<A>`, `A => void`  | `Option<A>` | callback called if it is a `Some<A>` |
| `inspectNone` | `Option<A>`, `() => void` | `Option<A>` | callback called if it is a `None`    |

Let's see an example where both are in action:

```ts
import { inspectSome, inspectNone } from "@fp-ts/core/Option";

const failure: Option<number> = pipe(
  some("a"),
  inspectSome(console.log),
  flatMap((s) => parseNumber(s)),
  inspectNone(() => console.error("none")),
  map((x) => x * 2),
  map((x) => x - 3)
);
// "a"
// "none"
```

Please note that these two functions should only be used for debugging purposes and it is not recommended to use them for performing side effects or encoding business logic.

# Pattern matching and error handling

We have seen how easy and convenient it is to build pipelines involving the `Option` data type, leaving it to handle any errors that may occur at any step. However, at some point, you will be interested in manually handling the error to understand the overall result obtained from the pipeline and decide what to do accordingly.

The `match` function allows us to match on the `None` and `Some` cases of an `Option` value and provide different actions for each.

We can use the `match` function to handle the `Option` value returned by `parseNumber` and decide what to do based on whether it's a `None` or a `Some`.

```ts
import { pipe } from "@fp-ts/core/Function";
import { match } from "@fp-ts/core/Option";

// parseNumber returns an Option<number>
const result = parseNumber("Not a number");

// Using pipe and match to pattern match on the result
const output = pipe(
  result,
  match(
    // If the result is a None, return an error string
    () => `Error: ${error}`,
    // If the result is a Some, return a string with the number
    (n) => `The number is ${n}`
  )
);

console.log(output); // Output: Error: Cannot parse 'Not a number' as a number
```

**Cheat sheet** (error handling)

| Name             | Given                                               | To                     |
| ---------------- | --------------------------------------------------- | ---------------------- |
| `match`          | `Option<A>`, `onNone: LazyArg<B>`, `onSome: A => C` | `B \| C`               |
| `getOrThrow`     | `Option<A>`                                         | `A`                    |
| `getOrElse`      | `Option<A>`, `onNone: LazyArg<B>`                   | `A \| B`               |
| `getOrNull`      | `Option<A>`                                         | `A \| null`            |
| `getOrUndefined` | `Option<A>`                                         | `A \| undefined`       |
| `orElse`         | `Option<A>`, `Option<B>`                            | `Option<A \| B>`       |
| `orElseEither`   | `Option<A>`, `Option<B>`                            | `Option<Either<A, B>>` |
| `firstSomeOf`    | `Option<A>`, `Iterable<Option<A>>`                  | `Option<A>`            |