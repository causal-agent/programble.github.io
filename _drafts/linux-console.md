---
title: Configuring the Linux Console
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

(Intro screenshot)

[HP Chromebook 11]: /2015/05/31/chromebook-vpn.html
[splat]: https://github.com/starkers/archbook
[Arch Linux ARM]: https://archlinuxarm.org

## Printk

First,
let's get an annoyance out of the way.
The kernel likes to dump log messages to the console,
for example whenever the wifi card does... something.
Those messages badly interfere
with curses applications
like Vim and tmux.

This would normally be solved
by adding `quiet` to the kernel command line,
but in the Chromebook's case
I'm not sure how to control that.

What the `quiet` option does
is influence the `kernel.printk` parameter,
documented in [`sysctl/kernel.txt`]
and [`syslog`].
By default,
`console_loglevel` gets set to 7,
which sends even debug logging to the console.
With `quiet`,
this gets set to 4 instead,
which logs only warnings and errors.

The parameter can manually be set
with the [`sysctl`] command,
or added in [`sysctl.d`]
to make it permanent.

    sysctl kernel.printk='4 5 1 4'
    echo 'kernel.printk = 4 5 1 4' > /etc/sysctl.d/printk.conf

[`sysctl/kernel.txt`]: https://github.com/torvalds/linux/blob/affb852d2fa260402cbdc77976adb0dcda3b5fae/Documentation/sysctl/kernel.txt#L712
[`syslog`]: http://man7.org/linux/man-pages/man2/syslog.2.html
[`sysctl`]: http://man7.org/linux/man-pages/man8/sysctl.8.html
[`sysctl.d`]: http://man7.org/linux/man-pages/man5/sysctl.d.5.html
