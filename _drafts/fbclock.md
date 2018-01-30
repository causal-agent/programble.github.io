---
title: Programming the Linux Framebuffer
---

[Previously][linux-console],
I installed Linux on a small ARM Chromebook
and set it up without X.Org,
using only the console.
After neglecting that machine
for quite some time,
I came back to it
because I wanted to try some
pixel-graphics programming
and the framebuffer seemed like
it might be an easy target.

I started by
bringing my configuration up to date
on the Chromebook
and noticed again how *good* it feels
to type on the console
with such [low latency].
I then got to messing around,
and it turns out the framebuffer
*is* easy to program,
but it's unfortunately a bit obscure.
While I was playing with it,
I found myself running `date`
every so often to check the time,
so decided a clock panel
would be a good first framebuffer program.

Programming a "panel" application,
i.e. one that stays visible in a corner,
is straightforward on the framebuffer
because programs just share the buffer
with the console itself.
Since the console only writes
to the buffer as necessary,
redrawing the panel periodically
is sufficient to keep it visible.

[linux-console]: /2017/05/05/linux-console.md
[low latency]: https://danluu.com/term-latency/

## The Device

As one might expect of old-timey Unix things,
the framebuffer can be accessed as a file,
the defaulf path of which is `/dev/fb0`.
You can basically just read and write pixel data to it.
For example, try running this
to put a white pixel
in the top-left corner of the screen
(you will need to be `root`
or add yourself to the `video` group):

    echo -en '\xFF\xFF\xFF\x00' > /dev/fb0

In order to put pixels wherever we want
without overwriting the whole screen,
we'll want to `mmap` the file instead,
and in order to do that we need to know
the dimensions of the buffer.
The [`linux/fb.h`] header defines
some [`ioctl`] calls which can be used
to interrogate the framebuffer file.

TODO: Link to that page I found?

[`linux/fb.h`]: https://github.com/torvalds/linux/blob/master/include/uapi/linux/fb.h
[`ioctl`]: http://man7.org/linux/man-pages/man2/ioctl.2.html

## The Font

TODO: Link to psf.h in kbd.

## The Time

TODO: Screenshot, link to code, encourage adaptation (GPL).
