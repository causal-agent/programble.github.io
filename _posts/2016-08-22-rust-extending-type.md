---
title: "Rust: Extending a Type"
---

Sometimes it is desirable
to add extra methods
to a foreign type,
i.e. a type defined
in an external crate.
In Rust,
this can be accomplished
with [traits][traits].

[traits]: https://doc.rust-lang.org/book/traits.html

## Problem

As an example,
let's add `before` and `after` methods
to the [`std::ops::Range<T>`][range] type.
They should work like this:

```rust
(3..5).before(); // ..3
(3..5).after(); // 5..
```

[range]: https://doc.rust-lang.org/std/ops/struct.Range.html

A naive attempt
to add these methods
would look like this:[^1]

```rust
use std::ops::{Range, RangeFrom, RangeTo};

impl<T: Copy> Range<T> {
    fn before(&self) -> RangeTo<T> {
        ..self.start
    }

    fn after(&self) -> RangeFrom<T> {
        self.end..
    }
}
```

[^1]: We bound `T` to `Copy` in order to keep the implementations simple.

But since `Range<T>` is not a local type,
we can't directly write an `impl` block for it.
The compiler tells us this:

```
error: cannot define inherent `impl` for a type outside of the crate where the type is defined; define and implement a trait or new type instead [--explain E0116]
 --> src/lib.rs:3:1
  |>
3 |> impl<T: Copy> Range<T> {
  |> ^
```

## Solution

The first solution it suggests
is to define and implement a trait.
By convention,
such "extension traits"
are named ending in `Ext`.

```rust
use std::ops::{Range, RangeFrom, RangeTo};

pub trait RangeExt<T> {
    fn before(&self) -> RangeTo<T>;
    fn after(&self) -> RangeFrom<T>;
}
```

We can then implement the trait
for the desired type,
since implementing local traits
for foreign types is allowed.

```rust
impl<T: Copy> RangeExt<T> for Range<T> {
    fn before(&self) -> RangeTo<T> {
        ..self.start
    }

    fn after(&self) -> RangeFrom<T> {
        self.end..
    }
}
```

The two methods are now available
on `Range<T>` objects
just like any other method.
To use the methods
in other modules as well,
it is necessary to `use RangeExt`.

Examples of this pattern
can be found
in the standard library:

- [`AsciiExt`][asciiext] adds ASCII-related methods to string types.
- [`MetadataExt`][metadataext] adds Linux-specific methods to file [`Metadata`][metadata].
- [`OsStrExt`][osstrext] and [`OsStringExt`][osstringext]
  add Unix-specific methods to OS string types.

[asciiext]: https://doc.rust-lang.org/std/ascii/trait.AsciiExt.html
[metadataext]: https://doc.rust-lang.org/std/os/linux/fs/trait.MetadataExt.html
[metadata]: https://doc.rust-lang.org/std/fs/struct.Metadata.html
[osstrext]: https://doc.rust-lang.org/std/os/unix/ffi/trait.OsStrExt.html
[osstringext]: https://doc.rust-lang.org/std/os/unix/ffi/trait.OsStringExt.html
