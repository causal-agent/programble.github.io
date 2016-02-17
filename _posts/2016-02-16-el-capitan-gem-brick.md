---
title: How to Brick OS X El Capitan Ruby Gem
discussions:
  - site: Lobsters
    href: https://lobste.rs/s/tgnykh/how_to_brick_os_x_el_capitan_ruby_gem
---

Here's the punchline:

```
sudo gem update --system
```

Now you have a `gem`
that is incapable of
installing gems which
provide binaries.
I don't recommend running this command.

### Why?

Mac OS X 10.11 El Capitan
shipped a feature called "system integrity protection" (SIP),
also known as "rootless."
What this means is that,
even as root,
there are directories that cannot be written to.

One such directory is `/usr/bin`,
where most system binaries are installed.
Trying to `touch /usr/bin/foo`,
even as root,
will give a "permission denied" error.
This is probably overall a good thing.

Obviously, though,
there are legitimate reasons
to write to this directory,
such as installing new binaries
from Ruby gems.
It seems that,
in order to solve this problem,
Apple has somehow blessed
the system `gem` binary
with the power to write to `/usr/bin`.
But this blessing
does not extend to
just any `gem` binary.

What happens when
you try to update the system Gem?

1. Run `sudo gem update --system`.
2. Current `gem` uses its blessing to overwrite `/usr/bin/gem` with a new
   version.
3. New `gem` no longer has blessing.

And then this happens:

```
$ sudo gem install rouge
ERROR: While executing gem ... (Errno::EPERM)
  Operation not permitted - /usr/bin/rougify
```

### Workaround

I've yet to find a real fix for this.
There doesn't seem to be
any way of getting
the original `gem` binary back.

The workaround is to
disable system integrity protection
entirely.

1. Reboot into recovery mode by holding the Command and R keys.
2. Open a terminal from the "Utilities" menu.
3. Run `csrutil disable`.
4. Reboot normally.

### The full story

Perhaps you, like Apple,
think that wanting to update
the system Gem
is an unreasonable thing
to expect to work.
There are, after all,
a [plethora][plethora] of ways
to avoid using the system Ruby
at all.

[plethora]: https://github.com/rvm/rvm/blob/master/docs/alt.md

But on my own MacBook,
I haven't been doing any
serious Ruby development,
so I hadn't bothered
with any of those.
I just needed Jekyll
so I could render this site locally.
Which is where this story starts.

#### Thanks, GitHub

In a recent [blog post][jekyll3],
GitHub announced that Pages
would now be running Jekyll 3.0.
Great,
except they also dropped support for
the Redcarpet markdown renderer
and the Pygments.rb highlighter,
both of which I was using.

[jekyll3]: https://github.com/blog/2100-github-pages-now-faster-and-simpler-with-jekyll-3-0

So I set about migrating
to Kramdown and Rouge,
which was surprisingly easy,
except that I was
having trouble getting the site
to render the same locally
as it did on GitHub Pages.

At some point,
I figured that an incorrect version
of a dependency was being used,
but I couldn't narrow it down.
There was no error,
the output just wasn't right.
Since Jekyll was pretty much
the only Ruby I was using,
I decided it would be easier
to just uninstall all my gems,
then reinstall all the latest versions.

A quick Google told me that
this could be done with `gem uninstall --all`,
but that the option was only available
in Gem 2.1 and newer.
The system Gem in El Capitan is only 2.0,
so I did the logical thing:
updated the system Gem.

Somehow,
the `gem uninstall` command worked after this.
It doesn't seem to care if it can
remove binaries or not.

Upon trying to reinstall
the needed gems, however,
everything stopped working.

```
ERROR: While executing gem ... (Errno::EPERM)
  Operation not permitted - /usr/bin/jekyll
```

This really confused me.
I was using `sudo`.
How was I getting a permissions error?
I tried just writing
a random file in `/usr/bin` as root.
Permissions error.
And then I remembered:
system integrity protection.

#### Thanks, Stack Overflow

Another quick Google
for how to disable SIP
and I was on my way.
I could install Jekyll again,
and my site rendered properly.

But since I think that SIP
is generally an okay thing,
I wasn't happy with the workaround.
I wanted my original `gem` back
so everything would be back to normal.

I tried to find out how to
reinstall the system Ruby on OS X.
A [Super User thread][superuser] gave me some bad advice.
It recommended downloading the OS X installer
and finding `Essentials.pkg`,
inside a `.dmg`,
inside the `.app`.
It claimed that this package
contained Ruby,
and that installing it
would reinstall Ruby.

[superuser]: http://superuser.com/questions/860819/reinstall-ruby-framework-on-os-x-yosemite

I was a fool to trust this information.

I waited a few hours
for the installer to download,
and then waited probably
half an hour more
for `Essentials.pkg` to do its thing.
When it was done:

```
$ gem --version
2.5.1
```

I still didn't have the old version of `gem`.
Oh well.
At least I could still use the one I had.
I moved on.

#### But I *am* an administrator!

Later that night,
I wanted some music,
so I launched [Radiant Player][radiant].
It had been a while,
so it prompted me for an update.

[radiant]: http://radiant-player.github.io/radiant-player-mac/

After the update was downloaded,
it again prompted me,
this time for an administrator password.
This isn't too unusual,
as some software needs elevated privileges
to install.

Usually when this happens,
the "Username" field is filled in,
and you just need to enter your password.
This time,
both fields were blank.
Weird.

So I typed my username and my password.
That didn't work.
I tried a few more times.
I tried "root",
but I don't think I ever set a root password.
I couldn't unlock it.

Looking in the "Users & Groups" pane
of "System Preferences",
sure enough,
I was a regular user.
A *regular user*.
I was horrified.
I even tried unlocking that pane,
only to be prompted with the same request
for adminstrator credentials.
I tried `sudo`,
which told me I wasn't a sudoer.
It felt like my own computer
had turned against me.

That `Essentials.pkg` clearly overwrote something,
it just wasn't `gem`.

#### Back to recovery mode

I love recovery mode.
I really do.
It makes me feel safe.
And it gives me a root terminal.

I figured I could just run `passwd` as root,
then use that to unlock the "Users & Groups" pane
and make myself an administrator again.

```
sh-3.2# passwd
sh: passwd: command not found
```

That's not good.
Thankfully,
further Googling
revealed that recovery mode
instead has a `resetpassword` command,
which launches a GUI for some reason.

In the end,
I managed to reinstate myself as administrator,
but `gem` is still unholy
and SIP is turned off.
Things are working, for now,
but I think it's probably
a good time to just reinstall OS X.

One last goof:
remember the OS X installer I downloaded
for hours?
I deleted it as soon as
I was done with `Essentials.pkg`.
