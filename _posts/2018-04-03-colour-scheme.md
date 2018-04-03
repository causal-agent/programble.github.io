---
title: I Made My Own Colour Scheme and You Can Too!
---

![Colour scheme][scheme.png]

Ever go looking for a new colour scheme
only to scroll through hundreds
without finding anything
just to your liking?
Have you tried
making your own?

I'd considered it before
but didn't really know how.
Most colour schemes
just give you some RGB hex values
with no indication of where they came from.
I've tried to pick colours in RGB before
and it's really hard!

It turns out that RGB
is just not a very good space
to manipulate colour in.
It's intuitive for computers
but not for humans.
That was important for me to realize
before trying to pick my own colours.

The colour space that I do find intuitive
is [HSV]: hue, saturation and value.
In this space,
hue is an angle around a circle
which determines *which* colour it is,
saturation is a fraction
which determines *how much* colour there is,
and value is a fraction
which determines how light or dark it is.
Wikipedia has some nice diagrams
of this as a cylinder.

[HSV]: https://en.wikipedia.org/wiki/HSL_and_HSV

Good starting points in HSV
are each of the hue extremes
60° apart around the circle:
red, yellow, green, cyan, blue and magenta.

    static const struct Hsv { double h, s, v; }
        R = {   0.0, 1.0, 1.0 },
        Y = {  60.0, 1.0, 1.0 },
        G = { 120.0, 1.0, 1.0 },
        C = { 180.0, 1.0, 1.0 },
        B = { 240.0, 1.0, 1.0 },
        M = { 300.0, 1.0, 1.0 };

To play with these,
I wrote a function
for deriving new colours
by offsetting hue
and multiplying saturation and value.
I couldn't come up with a good name for it.

    static struct Hsv x(struct Hsv o, double hd, double sf, double vf) {
        return (struct Hsv) {
            fmod(o.h + hd, 360.0),
            fmin(o.s * sf, 1.0),
            fmin(o.v * vf, 1.0),
        };
    }

For a terminal colour scheme,
there are 16 colours,
divided into "normal" and "bright" variants of
black, red, green, yellow, blue, magenta, cyan and white.
I call them "dark" and "light" instead.

    struct Ansi {
        enum { BLACK, RED, GREEN, YELLOW, BLUE, MAGENTA, CYAN, WHITE };
        struct Hsv dark[8];
        struct Hsv light[8];
    };

I started with the 8 light colours
and derived the corresponding dark colours
by reducing their values.

    static struct Ansi ansi(void) {
        struct Ansi a = {
            .light = {
                [BLACK]   = x(R, 0.0, 0.0, 0.0),
                [RED]     = x(R, 0.0, 1.0, 1.0),
                [GREEN]   = x(G, 0.0, 1.0, 1.0),
                [YELLOW]  = x(Y, 0.0, 1.0, 1.0),
                [BLUE]    = x(B, 0.0, 1.0, 1.0),
                [MAGENTA] = x(M, 0.0, 1.0, 1.0),
                [CYAN]    = x(C, 0.0, 1.0, 1.0),
                [WHITE]   = x(R, 0.0, 0.0, 1.0),
            },
        };
        for (int i = 0; i < 8; ++i) {
            a.dark[i] = x(a.light[i], 0.0, 1.0, 0.8);
        }
        return a;
    }

I wrote code in [`scheme.c`]
to convert HSV to RGB
(from the explanation on Wikipedia)
and produce colour swatch PNGs.
The result at this point
wasn't very easy on the eyes.

![ANSI colours][ansi.png]

[`scheme.c`]: https://github.com/programble/dotfiles/blob/e9834a80ca32c65c8341558ce73c46ff5319e628/bin/scheme.c

From there I spent a day
modifying the values in each of those `x` calls.
I wanted an earthy scheme
similar to [gruvbox],
so I moved the hues more towards red
and decreased the saturations
of blue, magenta and cyan.
I tweaked values
and checked the regenerated PNG
to see how it looked.
Once I was satisfied with the blocks of colour,
I loaded them into my terminal emulator
and made further adjustments
for readability.

[gruvbox]: https://github.com/morhetz/gruvbox

This is what I came up with!

    static struct Ansi ansi(void) {
        struct Ansi a = {
            .light = {
                [BLACK]   = x(R, +45.0, 0.3, 0.3),
                [RED]     = x(R, +10.0, 0.9, 0.8),
                [GREEN]   = x(G, -55.0, 0.8, 0.6),
                [YELLOW]  = x(Y, -20.0, 0.8, 0.8),
                [BLUE]    = x(B, -55.0, 0.4, 0.5),
                [MAGENTA] = x(M, +45.0, 0.4, 0.6),
                [CYAN]    = x(C, -60.0, 0.3, 0.6),
                [WHITE]   = x(R, +45.0, 0.3, 0.8),
            },
        };
        a.dark[BLACK] = x(a.light[BLACK], 0.0, 1.0, 0.3);
        a.dark[WHITE] = x(a.light[WHITE], 0.0, 1.0, 0.6);
        for (int i = RED; i < WHITE; ++i) {
            a.dark[i] = x(a.light[i], 0.0, 1.0, 0.8);
        }
        return a;
    }

![Colour scheme][scheme.png]
([RGB hex values][hex])

I haven't yet come up with
a "day" version of this scheme,
but setting the values to `1.0 - v`
seems like a good place to start.
I need to wait for a day when
I can sit outside in the sun
and really see how it holds up.

I want to be clear that I have zero design training
and just went with that looked most pleasing to me.
I'm very happy with the result,
and think that others
could have similar experiences.
I hope this inspires you to create!

[scheme.png]: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAEACAMAAAAa+/QWAAAAMFBMVEUWFRCjKBByehijdyA9YmZ6SVVVelV6cVVMRjXMMhSOmR7MlShMe3+ZW2trmWvMvI5I7etOAAADJ0lEQVR4nO3WMRHAAAwDsaZT+SMuDA8vEXCmv9wzdvbt2595x/vAkABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABA2H3rA+zbtz/jA4AwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYCwHzJ9AhXZ1YluAAAAAElFTkSuQmCC
[ansi.png]: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAEACAMAAAAa+/QWAAAAMFBMVEUAAADMAAAAzADMzAAAAMzMAMwAzMzMzMwAAAD/AAAA/wD//wAAAP//AP8A//////+IR006AAADJ0lEQVR4nO3WMRHAAAwDsaZT+SMuDA8vEXCmv9wzdvbt2595x/vAkABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABA2H3rA+zbtz/jA4AwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYCwHzJ9AhXZ1YluAAAAAElFTkSuQmCC
[hex]: data:text/plain;base64,MTYxNTEwCmEzMjgxMAo3MjdhMTgKYTM3NzIwCjNkNjI2Ngo3YTQ5NTUKNTU3YTU1CjdhNzE1NQo0YzQ2MzUKY2MzMjE0CjhlOTkxZQpjYzk1MjgKNGM3YjdmCjk5NWI2Ygo2Yjk5NmIKY2NiYzhlCg==
