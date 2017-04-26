---
title: Configuring the Linux Console
---

I recently dug up my [HP Chromebook 11] again
with the intent of installing Linux or a BSD
on it and using it as a lightweight
and distraction-free development environment.
I previously thought there hadn't been
much success replacing Chrome OS on the device,
but this time I found [splat],
a script for installing [Arch Linux ARM]
on this specific model.

Installation went surprisingly well,
and I was dropped into a Linux console.
I chose not to install X.Org
to limit distractions
and keep myself sane,
so I started reading about the console.
It turns out to be quite customizable
and easy to configure.
I am very happy with the results!

[HP Chromebook 11]: /2015/05/31/chromebook-vpn.html
[splat]: https://github.com/starkers/archbook
[Arch Linux ARM]: https://archlinuxarm.org

## Keymap

Keymaps control
how the raw input from the keyboard
is translated to logical key presses.
The default layouts are in `/usr/share/kbd/keymaps`,
for example US QWERTY is defined in `i386/qwerty/us.map.gz`.
The [`keymaps(5)`] manual page
describes the format of these files,
most usefully the `include` directive
which allows keymaps to inherit from others.
These files can be loaded
with the [`loadkeys`] command,
and the [`showkey`] command
can be used to observe the raw keyboard input.[^1]

The layout I use elsewhere
is based on US QWERTY
with caps lock mapped to escape
and a number of keys
swapped with their shifted counterparts.
By reading the existing keymaps
and using `showkey`,
I was able to easily recreate it.
My [`custom.map`] looks like this:

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
The default sequences
are listed in `include/compose.latin1`,
and more can be added
in keymap files.

Lastly,
the keymap can be loaded by default
by setting its path in [`/etc/vconsole.conf`]:

    KEYMAP=/home/curtis/Code/dotfiles/custom.map

[^1]: These commands work fine
      when run directly from a console,
      but seem to need `sudo`
      to work in `tmux`,
      for example.

[`loadkeys`]: http://man7.org/linux/man-pages/man1/loadkeys.1.html
[`keymaps(5)`]: http://man7.org/linux/man-pages/man5/keymaps.5.html
[`showkey`]: http://man7.org/linux/man-pages/man1/showkey.1.html
[`custom.map`]: https://github.com/programble/dotfiles/blob/fa22c1e9a9ff6aa1e5b40fc75033d3f5611b3ba0/custom.map
[compose key]: https://en.wikipedia.org/wiki/Compose_key
[`/etc/vconsole.conf`]: http://man7.org/linux/man-pages/man5/vconsole.conf.5.html

## Font

Similar to keymaps,
bitmap fonts for the console
can be found in `/usr/share/kbd/consolefonts`,
and the [`setfont`] command
is used to load them.
A simple shell for loop can be used
to try each font in sequence:

    for font in *.gz; do
        read
        echo "$font"
        setfont -16 "$font"
    done

The `-16` option to `setfont`
selects the 16-pixel high variant
in files which contain several sizes.

The default font is DOS-nostalgic,
but I find it too thick.
Most of the included fonts
are quite similar,
but there is a version of [Terminus]
called `Lat2-Terminus16`.

Again, the font can be set in [`/etc/vconsole.conf`]:

    FONT=Lat2-Terminus16

[`setfont`]: http://man7.org/linux/man-pages/man8/setfont.8.html
[Terminus]: http://terminus-font.sourceforge.net

## Colours

Colours are somewhat less convenient
than keymaps and fonts.
The colours used by the console
for each of the 16 terminal colours
can be set using escape sequences
documented in [`console_codes(4)`].
The relevant sequence is `ESC ] P nrrggbb`,
which sets colour `n` to a hex RGB value.

I wrote [`console.sh`]
to set [Gruvbox] colours
then clear the screen.
Without `clear`,
the colours would only apply
to newly printed characters.
The easiest way
to make the colours permanent
is to add the escape sequences to [`/etc/issue`],
which gets printed to every console:

    ./console.sh > issue.new
    cat /etc/issue >> issue.new
    sudo mv issue.new /etc/issue

[`console_codes(4)`]: http://man7.org/linux/man-pages/man4/console_codes.4.html
[`console.sh`]: https://github.com/programble/dotfiles/blob/fa22c1e9a9ff6aa1e5b40fc75033d3f5611b3ba0/console.sh
[Gruvbox]: https://github.com/morhetz/gruvbox
[`/etc/issue`]: http://man7.org/linux/man-pages/man5/issue.5.html

## Cursor

Blink and shape.

## Printk and CPU scaling

## Brightness control and applications
