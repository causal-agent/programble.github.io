---
title: Using make — writing less Makefile
discussions:
  - site: Lobsters
    href: https://lobste.rs/s/7ubo0n/using_make_writing_less_makefile
---

<ins>
This post is a mirror of <https://text.causal.agency/001-make.txt>.
</ins>

Let's talk about
make(1).
I think an important thing to know about
make(1)
is that you don't need to write a
*Makefile*
to use it.
There are default rules
for C, C++ and probably Fortran.
To build
*foo*
from
*foo.c*,
just run:

	make foo

The default rule for C files uses the
`CFLAGS`
variable,
so you can set that in the environment
to pass flags to the C compiler:

	CFLAGS=-Wall make foo

It also uses
`LDLIBS`
for linking,
so you can add libraries with:

	LDLIBS=-lcurses make foo

Obviously writing this every time
would become tedious,
so it might be time to write a
*Makefile*.
But it really doesn't need much:

	CFLAGS += -Wall -Wextra
	LDLIBS = -lcurses
	
	foo:

Assigning
`CFLAGS`
with
'`+=`'
preserves the system default
or anything passed in the environment.
Declaring
*foo*
as the first rule
makes it the default when
'`make`'
is run without a target.
Note that the rule doesn't need a definition;
the default will still be used.

If
*foo*
is built from serveral source files,
unfortunately a rule definition is required:

	OBJS = foo.o bar.o baz.o
	
	foo: $(OBJS)
		$(CC) $(LDFLAGS) $(OBJS) $(LDLIBS) -o $@

This rule uses
`LDFLAGS`
for passing linker flags,
which is what the default rule does.
The
'`$@`'
variable here expands to
'`foo`',
so this rule can be copied easily
for other binary targets.

If some sources depend on a header file,
they can be automatically rebuilt
when the header changes
by declaring a dependency rule:

	foo.o bar.o: foo.h

Note that several files can appear
either side of the
'`:`'.

Lastly,
it's always nice to add a
**clean**
target:

	clean:
		rm -f $(OBJS) foo

I hope this helps getting started with
make(1)
without writing too much
*Makefile*!

### Examples

The example
*Makefile*
in its entirety:

	CFLAGS += -Wall -Wextra
	LDLIBS = -lcurses
	OBJS = foo.o bar.o baz.o
	
	foo: $(OBJS)
		$(CC) $(LDFLAGS) $(OBJS) $(LDLIBS) -o $@
	
	foo.o bar.o: foo.h
	
	clean:
		rm -f $(OBJS) foo
