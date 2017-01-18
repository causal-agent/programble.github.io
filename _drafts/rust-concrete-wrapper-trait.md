---
title: "Rust: Creating Trait Objects for Traits with Generic Methods"
---

One of the rules
for being able to create [trait objects]
in Rust
is that the trait
cannot have any generic methods.

For instance,
the [`Sample`] trait from `rand`
contains a generic `sample` method.

    pub trait Sample<Support> {
        fn sample<R: Rng>(&mut self, rng: &mut R) -> Support;
    }

If we want to do dynamic dispatch
on this trait,
we might have something
like this...

    struct Sampler {
        sample: Box<Sample<f64>>,
    }

...which won't work.

    error[E0038]: the trait `rand::distributions::Sample` cannot be made into an object
     --> src/main.rs:6:5
      |
    6 |     sample: Box<Sample<f64>>,
      |     ^^^^^^^^^^^^^^^^^^^^^^^^ the trait `rand::distributions::Sample` cannot be made into an object
      |
      = note: method `sample` has generic type parameters

This makes sense,
since in order to build a trait object,
the compiler needs to populate a [vtable]
with function pointers
to the code for each method.
With generic methods,
the code doesn't even exist
unless it is called with a concrete type.

Fortunately,
if we know the concrete type
we will be passing to `sample`,
we can create a wrapper trait.


    use rand::ThreadRng;
    trait ThreadRngSample<Support> {
        fn thread_rng_sample(&mut self, rng: &mut ThreadRng) -> Support;
    }

[trait objects]: https://doc.rust-lang.org/book/trait-objects.html
[`Sample`]: https://docs.rs/rand/0.3.15/rand/distributions/trait.Sample.html
[vtable]: https://en.wikipedia.org/wiki/Virtual_method_table
