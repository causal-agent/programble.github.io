---
title: Baby's First JIT
---

Let's learn how to write
a basic [just-in-time compiler][jit].
A JIT compiler is a piece of software
which generates machine code at runtime
*just* before executing it.
Many supposedly "interpreted" languages
actually compile code on the fly
with this technique.

[jit]: https://en.wikipedia.org/wiki/Just-in-time_compilation

---

First we'll need to include some header files.
Apart from the usual,
we'll need `sys/mman.h`
for [`mmap`][mmap] and [`mprotect`][mprotect]
and `unistd.h` for [`getpagesize`][getpagesize].
We'll also use [`err.h`][err] and [`sysexits.h`][sysexits]
for error handling and exit codes, respectively.

    #include <stdlib.h>
    #include <stdio.h>
    #include <stdint.h>
    #include <sys/mman.h>
    #include <unistd.h>
    #include <err.h>
    #include <sysexits.h>

[mmap]: https://www.freebsd.org/cgi/man.cgi?sektion=2&query=mmap
[mprotect]: https://www.freebsd.org/cgi/man.cgi?sektion=2&query=mprotect
[getpagesize]: https://www.freebsd.org/cgi/man.cgi?sektion=3&query=getpagesize
[err]: https://www.freebsd.org/cgi/man.cgi?sektion=3&query=err
[sysexits]: https://www.freebsd.org/cgi/man.cgi?sektion=3&query=sysexits

This is C by the way.

    int main(int argc, char *argv[]) {
        return EX_OK;
    }

The main idea behind a JIT compiler
is to allocate some memory,
write machine code into it,
then execute it.
To allocate memory which can be executed,
we need to use `mmap`.
However,
modern CPUs won't let us
write and execute the same bit of memory
at the same time,
so we'll start by setting it read-write
and switch it later.

Allocation through `mmap` also works
only at the granularity of [pages][page].
Since we won't be generating a whole lot of code,
we'll just allocate one page worth of memory.

    int page = getpagesize();
    uint8_t *code = mmap(NULL, page, PROT_READ | PROT_WRITE, MAP_ANON | MAP_PRIVATE, -1, 0);
    if (code == MAP_FAILED) err(EX_OSERR, "mmap");

[page]: https://en.wikipedia.org/wiki/Page_(computer_memory)

The `MAP_ANON` flag tells `mmap`
to just map some plain old memory,
rather than memory-map a file,
which it can also do.
The `-1` would be a file descriptor,
if we were doing that.

The `MAP_PRIVATE` flag means that
the contents of this page
won't be shared between child processes,
i.e. they each get their own copy-on-write data.
This isn't relevant since we won't be calling [`fork`][fork].

[fork]: https://www.freebsd.org/cgi/man.cgi?sektion=2&query=fork

---

Next we'll have to write some machine code
into the memory.
How do we know what to write?
We can ask an [assembler][assembly],
such as [NASM][nasm].
We're going to generate an adder function,
which simply adds some number
to its first argument
and returns it.

    bits 64
    mov rax, strict dword 0
    add rax, rdi
    ret

[assembly]: https://en.wikipedia.org/wiki/Assembly_language
[nasm]: http://nasm.us

The `bits 64` directive
tells NASM to generate x86_64 code.
It can also generate 32- and 16-bit code.

The `mov` instruction
sets the `rax` register
to a 32-bit value of zero.
This is the value we'll be replacing
at runtime.
The `strict` modifier
tells NASM not to optimize
the immediate (or literal)
down to just one byte.

The `add` instruction
then adds our value with `rdi`,
which is the register in which
the first argument is passed
according to the [System V ABI][abi].
The ABI also specifies that
the return value of a function
is stored in `rax`.

So with the result of our calculation
in the correct register,
we can use `ret`
to return control to
whichever function called this one.

[abi]: https://software.intel.com/sites/default/files/article/402129/mpx-linux64-abi.pdf

If we assemble this with `nasm foo.asm`,
we can use a hexdump tool
such as `xxd -g1`
to inspect the machine code of `foo`.

    48 c7 c0 00 00 00 00 48 01 f8 c3

And that's all it is.
We can clearly see the four zero bytes
making up our 32-bit immediate.
Let's parse a number
from the command line
to replace this with.

    if (argc < 2) return EX_USAGE;
    int32_t term = (int32_t)strtol(argv[1], NULL, 10);

Now we can write out the code to memory,
keeping in mind that x86 is a [little-endian][endianness] architecture,
which means that the least significant byte
of a number appears first in memory.

    code[0] = 0x48;
    code[1] = 0xc7;
    code[2] = 0xc0;
    code[3] = (uint8_t)term;
    code[4] = (uint8_t)(term >> 8);
    code[5] = (uint8_t)(term >> 16);
    code[6] = (uint8_t)(term >> 24);
    code[7] = 0x48;
    code[8] = 0x01;
    code[9] = 0xf8;
    code[10] = 0xc3;

[endianness]: https://en.wikipedia.org/wiki/Endianness

---

To call our generated function
from C,
we'll need a function pointer type
to cast the `code` memory to.

    typedef int32_t (*fptr)(int32_t);

This declares the `fptr` type
as a pointer to a function
which takes a single integer parameter
and returns an integer.

Currently, though,
trying to execute our generated code
will crash the process.
We first need to set the page's protection
to allow execution and disallow writes.

    int error = mprotect(code, page, PROT_READ | PROT_EXEC);
    if (error) err(EX_OSERR, "mprotect");

Now we can call the function
with a few numbers
and display the results.

    fptr fn = (fptr)code;
    printf("%d %d %d\n", fn(1), fn(2), fn(3));

---

Time to compile some code on the fly!
We've made a JIT compiler.

    $ ./babyjit 1
    2 3 4
    $ ./babyjit 2
    3 4 5
    $ ./babyjit -4
    -3 -2 -1

The code is available as a [gist][gist],
unobstructed by my words.

[gist]: https://gist.github.com/programble/2ec38cee7d654e7f1755c91d38882a88
