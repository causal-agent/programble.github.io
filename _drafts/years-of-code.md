---
title: X Years of Code in Review
---

I was recently going through all
~80 of my GitHub repositories,
and got thinking about my old projects.

I think I started doing something
one might describe as "programming"
around the end of primary school.
I remember that, in the first year of secondary school
(I was twelve),
I had a little notebook
in which I wrote down ideas
I had for projects.

Unfortunately,
most of those projects are long gone;
worked on several computers ago
and insufficiently backed up.
But from December 2009,
when I joined GitHub at fourteen years old,
there is a quite complete record
of everything I've worked on
in my free time.

I thought it might be fun
to go over my old projects.

<p class="text-center">
  <a href="/image/years-of-code/github.png">
    <img alt="My GitHub profile" width="244" src="/image/years-of-code/github.png">
  </a>
</p>

## Before GitHub

Before getting to the repositories,
here is a quick list of some projects
I remember from before 2009:

MiniOS
: Really a sort of shell replacement in Visual Basic .NET.
  Consisted of a full-screen window
  recreating the desktop
  with a task bar and start menu.

Filescape
: A file manager in VB.NET, with the beginnings of a batch language.
  I think I also started working
  on a Python version on Linux
  later on.

Fireworks
: A fireworks screensaver in VB.NET.
  I remember learning to use trigonometry
  to have the particles spread out in a circle,
  years before I learned it in school.

JoyMouse (?)
: A .NET (maybe C#) application
  for controlling the mouse with a joystick or gamepad.
  I finished this right before
  completely hosing my system
  and lost all my work.

Minaptic
: A small Python and GTK wrapper around APT,
  made shortly after I first started using GNU/Linux.

## GitHub repositories

To get a list of my repositories
in the order they were created,
I used the GitHub API,
HTTPie,
and jq.
The command looked something like this:

```sh
http https://api.github.com/user/repos \
  visibility==public \
  sort==created \
  direction==asc \
  per_page==100 \
  | jq 'map(.name)'
```
