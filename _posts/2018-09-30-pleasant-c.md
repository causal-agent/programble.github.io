---
title: Pleasant C
discussions:
  - site: Lobsters
    href: https://lobste.rs/s/er4qpl/pleasant_c_it_s_good_actually
---

<ins>
This post is a mirror of <https://text.causal.agency/003-pleasant-c.txt>.
</ins>

I've been writing a lot of C lately
and actually find it very pleasant.
I want to talk about some of its ergonomic features.
These are C99 features unless otherwise noted.

#### Initializer syntax

Struct and union initializer syntax
is well generalized.
Designators can be chained,
making initializing nested structs easy,
and all uninitialized fields are zeroed.

	struct {
		struct pollfd fds[2];
	} loop = {
		.fds[0].fd = STDIN_FILENO,
		.fds[1].fd = STDOUT_FILENO,
		.fds[0].events = POLLIN,
		.fds[1].events = POLLOUT,
	};

#### Variable-length arrays

VLAs can be multi-dimensional,
which can avoid manual stride multiplications
needed to index a flat
malloc(3)'d
array.

	uint8_t glyphs[len][height][width];
	fread(glyphs, height * width, len, stdin);

#### Incomplete array types

The last field of a struct can be an
"incomplete"
array type,
which means it doesn't have a length.
A variable amount of space for the struct can be
malloc(3)'d,
or the struct can be used as
a sort of pointer with fields.

	struct Line {
		enum Filter type;
		uint8_t data[];
	} *line = &png.data[1 + lineSize()];

#### Anonymous struct and union fields (C11)

Members of structs or unions
which are themselves structs or unions
can be unnamed.
In that case,
each of the inner fields
is treated as a member of the outer struct or union.
This makes working with tagged unions nicer.

	struct Message {
		enum { Foo, Bar } type;
		union {
			uint8_t foo;
			uint32_t bar;
		};
	} msg = { .type = Foo, .foo = 0xFF };

#### Static assert (C11)

Assertions can be made at compile time.
Most useful for checking sizes of structs.

	static_assert(13 == sizeof(struct PNGHeader), "PNG IHDR size");

#### Leading-break switch

This one is just an odd style choice
I came across that C happens to allow.
To prevent accidental fall-through
in switch statements,
you can put breaks before the case labels.

	while (0 < (opt = getopt(argc, argv, "h:w:"))) {
		switch (opt) {
			break; case 'h': height = optarg;
			break; case 'w': width = optarg;
			break; default:  return EX_USAGE;
		}
	}

### Caveats

This isn't meant to be advice.
It's just how I like to write C,
and I don't
"ship"
software in C.
