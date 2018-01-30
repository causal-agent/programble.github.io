---
title: Configuring the Linux Console
discussions:
  - site: Lobsters
    href: https://lobste.rs/s/kxntez/configuring_linux_console
---

I recently dug up my [HP Chromebook 11] again
and wanted to install a BSD or Linux on it
to use as a lightweight
and distraction-free development environment.
I used [splat] to install [Arch Linux ARM]
which worked flawlessly.

To the distraction-free end,
I decided not to install X.Org
and stick to the console.
It's not the most comfortable
environment by default,
but it can actually be configured
in many of the same ways
as graphical terminal emulators!

[![Editing this post on the Linux console](/image/linux-console.png)](/image/linux-console.png)

[HP Chromebook 11]: /2015/05/31/chromebook-vpn.html
[splat]: https://github.com/starkers/archbook
[Arch Linux ARM]: https://archlinuxarm.org

### Printk

First,
let's get an annoyance out of the way.
The kernel likes to log message to the console,
for example whenever the wifi card does a thing.
Those messages badly interfere
with curses applications.

This would normally be solved
by adding `quiet` to the kernel command line,
but in the Chromebook's case
I'm not sure how to control that.
What the `quiet` option does
is set the `kernel.printk` parameter,
documented in [`sysctl/kernel.txt`] and [`syslog`].
By default,
`console_loglevel` is set to 7
for debug logging,
but `quiet` sets it to 4
for warning logging.

The parameter can be set manually
with the [`sysctl`] command,
and made permanent in [`sysctl.d`]:

    sysctl kernel.printk='4 5 1 4'
    echo 'kernel.printk = 4 5 1 4' > /etc/sysctl.d/printk.conf

[`sysctl/kernel.txt`]: https://github.com/torvalds/linux/blob/affb852d2fa260402cbdc77976adb0dcda3b5fae/Documentation/sysctl/kernel.txt#L712
[`syslog`]: http://man7.org/linux/man-pages/man2/syslog.2.html
[`sysctl`]: http://man7.org/linux/man-pages/man8/sysctl.8.html
[`sysctl.d`]: http://man7.org/linux/man-pages/man5/sysctl.d.5.html

### Font

Bitmap fonts for the console
can be found in `/usr/share/kbd/consolefonts`,
and can be loaded
with the [`setfont`] command.
A simple shell for loop can be used
to try each font.
The `-16` option to `setfont`
selects the 16-pixel high variant
in files which contain several sizes:

    for font in *.gz; do
        read
        echo "$font"
        setfont -16 "$font"
    done

Most of the fonts are DOS-nostalgic,
but there are a few quirky ones
such as `cybercafe`,
and a nice version of [Terminus]
called `Lat2-Terminus16`.
A few extras might be packaged
in your distribution of choice.

The console font can be set permanently
in [`/etc/vconsole.conf`]:

    echo 'FONT=Lat2-Terminus16' >> /etc/vconsole.conf

[`setfont`]: http://man7.org/linux/man-pages/man8/setfont.8.html
[Terminus]: http://terminus-font.sourceforge.net
[`/etc/vconsole.conf`]: http://man7.org/linux/man-pages/man5/vconsole.conf.5.html

### Colours

The palette used by the console
for each of the 16 terminal colours
can be set using escape sequences
documented in [`console_codes`].
The relevant sequence is `ESC ] P nrrggbb`,
which sets colour `n` to a hex RGB value.

I wrote [`console.sh`],
which sets [Gruvbox] colours
then clears the screen.
Without `clear`,
the palette would only apply
to newly printed characters.
The easiest way to make these colours permanent
is to add the escape sequences to [`/etc/issue`],
which gets printed before the login prompt
on every TTY:

    ./console.sh > issue.new
    cat /etc/issue >> issue.new
    sudo install --mode 644 issue.new /etc/issue

[`console_codes`]: http://man7.org/linux/man-pages/man4/console_codes.4.html
[`/etc/issue`]: http://man7.org/linux/man-pages/man5/issue.5.html
[`console.sh`]: https://github.com/programble/dotfiles/blob/fa22c1e9a9ff6aa1e5b40fc75033d3f5611b3ba0/console.sh
[Gruvbox]: https://github.com/morhetz/gruvbox

### Cursor

By default,
the hardware cursor blinks,
which can be annoying.
It can be disabled
by writing `0`
to `/sys/class/graphics/fbcon/cursor_blink`.
It can be made permanent
by writing a file in [`tmpfiles.d`]:

    echo 'w /sys/class/graphics/fbcon/cursor_blink - - - - 0' > /etc/tmpfiles.d/cursor_blink.conf

The default cursor shape
is an underline,
but can be changed to a block
with an escape sequence.
The [terminfo] database
defines the capabilities
`cnorm`, `civis` and `cvvis`
for normal,
invisible
and "very visible" cursor,
respectively.
These are loosely defined,
but "very visible" on the console
results in a block cursor.

The [`tput`] command
prints escape sequences
from the terminfo database.
Running `tput cvvis` directly on a console
sets the cursor to block temporarily,
but curses applications reset it with `cnorm`.
In [tmux],
`cvvis` doesn't do anything at all.
However,
tmux has an option
for overriding terminfo,
which can be used to set `cnorm`
to the sequence for `cvvis`:

    set -g terminal-overrides "linux:cnorm=\e[?25h\e[?8c"

[`tmpfiles.d`]: http://man7.org/linux/man-pages/man5/tmpfiles.d.5.html
[terminfo]: http://man7.org/linux/man-pages/man5/terminfo.5.html
[`tput`]: http://man7.org/linux/man-pages/man1/tput.1.html
[tmux]: https://tmux.github.io

### Keymap

Keymaps control
how the raw input
from the keyboard
is translated to logical key presses.
Similar to fonts,
default layouts are in `/usr/share/kbd/keymaps`
and can be loaded with the [`loadkeys`] command.

As described
in the [`keymaps(5)`] manual page,
keymaps can inherit from each other
using the `include` directive.
This makes it easy to add overrides,
for example,
to the default US QWERTY layout
in `i386/qwerty/us.map.gz`.
The [`showkey`] command
can be used to observe
the raw keyboard input.

The layout I use
has caps lock mapped to escape
and many keys
swapped with their shifted counterparts.
My [`custom.map`] file looks like this:

    include "/usr/share/kbd/keymaps/i386/qwerty/us.map.gz"
    keycode 2 = exclam one
    keycode 3 = at two
    keycode 4 = numbersign three
    …
    keycode 100 = Compose
    keycode 125 = Escape

I also mapped right alt
to [compose key],
which I didn't know
was supported on the console.
The default sequences are listed
in `include/compose.latin1`,
and more can be added
in keymap files.

In the same way as the font,
the keymap can be set permanently
in [`/etc/vconsole.conf`]:

    echo 'KEYMAP=/home/curtis/Code/dotfiles/custom.map' >> /etc/vconsole.conf

[`loadkeys`]: http://man7.org/linux/man-pages/man1/loadkeys.1.html
[`keymaps(5)`]: http://man7.org/linux/man-pages/man5/keymaps.5.html
[`showkey`]: http://man7.org/linux/man-pages/man1/showkey.1.html
[`custom.map`]: https://github.com/programble/dotfiles/blob/fa22c1e9a9ff6aa1e5b40fc75033d3f5611b3ba0/custom.map
[compose key]: https://en.wikipedia.org/wiki/Compose_key

### Applications

As a final note,
these are the applications
I use on the console:

- [`jfbview`], PDF viewer;
- [`fbv`], image viewer;
- [`fbgrab`], screenshot tool, with [patch].

[`jfbview`]: https://aur.archlinux.org/packages/jfbview/
[`fbv`]: https://www.archlinux.org/packages/community/x86_64/fbv/
[`fbgrab`]: https://www.archlinux.org/packages/community/x86_64/fbgrab/
[patch]: https://github.com/programble/fbgrab/commit/60c979319cdcfedafee1922c91d52f2d9e95db1e
