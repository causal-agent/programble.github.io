---
layout: post
title: Scheduled Suspend and Resume With systemd
---

I recently replaced my main computer with a MacBook Pro and found myself
with a spare [Lenovo IdeaPad U410][u410]. Having a 32GB SSD and a 500GB
HDD, I decided to set it up as a file server on my LAN.

This was all well and good, but having an always-on Intel i5 serving
files I'm only likely to access during a handful of hours in the day
seemed incredibly wasteful. I figured the server would only need to be
on during the evenings when I'm at home, and suspended the rest of the
time. I set out to automate this.

 [u410]: http://shop.lenovo.com/us/en/laptops/ideapad/u-series/u410/

## Ignoring Lid Close

The first step to automating the suspend/resume cycle is something I had
already configured earlier, which is disabling automatic suspend when
the lid is closed. Kind of important for a laptop server.

The way to do this with [systemd][systemd] (the init system we all know and
love) is in `/etc/systemd/logind.conf`:

    HandleLidSwitch=ignore

In order for this change to take effect, the `logind` service must be
restarted:

    systemctl restart systemd-logind

More information on power management with systemd can be found on the
[Arch Linux Wiki][archpm].

 [systemd]: http://freedesktop.org/wiki/Software/systemd/
 [archpm]: https://wiki.archlinux.org/index.php/Shutdown_Pressing_Power_Button#Power_management_with_systemd

## systemd Timers

systemd has a [timer system][timers] that can be used to invoke systemd
services similarly to cron. The `OnCalendar` option of timers can be
used to trigger a timer at certain times according to a [calendar event
rule][events].

 [timers]: http://www.freedesktop.org/software/systemd/man/systemd.timer.html
 [events]: http://www.freedesktop.org/software/systemd/man/systemd.time.html#Calendar%20Events

### Suspend

In my case, I wanted to have my server suspend itself every day at 3 AM
(I'm usually in bed by this time). To do this, I created
`/etc/systemd/system/auto-suspend.timer`:

    [Unit]
    Description=Automatically suspend on a schedule

    [Timer]
    OnCalendar=*-*-* 03:00:00

    [Install]
    WantedBy=timers.target

By default, a timer will invoke a service by the same name when
triggered, so I created `/etc/systemd/system/auto-suspend.service`:

    [Unit]
    Description=Suspend

    [Service]
    Type=oneshot
    ExecStart=/usr/bin/systemctl suspend

The service simply runs the systemd command to suspend the computer. I
imagine there might be a better way to do it, but this way works fine.

### Resume

Another handy feature of systemd timers is the ability to wake the
system when triggered, with the `WakeSystem` option. I wanted my server
to resume at 6:30 PM, around the time I usually get home, so I created
`/etc/systemd/system/auto-resume.timer`:

    [Unit]
    Description=Automatically resume on a schedule

    [Timer]
    OnCalendar=*-*-* 18:30:00
    WakeSystem=true

    [Install]
    WantedBy=timers.target

This should do it, but the timer still wants to invoke a service, so I
created a no-op in `/etc/systemd/system/auto-resume.service`:

    [Unit]
    Description=Does nothing

    [Service]
    Type=oneshot
    ExecStart=/bin/true

Once again, there is likely a better way to achieve this, but I am no
systemd expert.

### Make it Go

To turn these timers on, enable and start them:

    systemctl enable auto-suspend.timer
    systemctl start auto-suspend.timer

    systemctl enable auto-resume.timer
    systemctl start auto-resume.timer

Now my Lenovo sits on a shelf with the lid closed, only fully powered on
and serving files for 8.5 hours of the day instead of 24.

## Caveats

I haven't quite figured out how to change the suspend/resume schedule on
weekends, when I spend more time at home. I'm sure I just need to read a
bit more on [systemd Calendar Events][events], but it's not the weekend
yet, so I'll worry about it later.
