---
title: Various Ideas
---

This is a list of ideas which,
over time,
have made their way
onto my list,
and then stayed there.
Since it seems unlikely
that I'll pursue these,
I'm sharing them publicly.
Maybe someone will find one interesting enough
to do something with.
Also,
if any of these already exist,
please let me know.
I'd like to use them.

These are ordered oldest first,
though I don't know how old they are.

## "Internet layer audio record listen thing"

This idea was to have a page
that simultaneously played and recorded
audio for some short duration.
Every time someone loaded the page,
they would hear a layering
of all previous recordings,
and the sound from their microphone
would be incorporated
for the next user.

When I thought of this,
I spent a bit of time
looking in to the state
of web audio APIs.
They didn't seem up to the task
at the time,
and I don't know if that's changed.

## Upvote downvote anything

This one is a browser extension
that adds Reddit-style voting buttons
to every block element
(or by some heuristic)
on every page.
Sorting the entire page by votes
could then be toggled.
Democratize the priority of all content!

## Random rememberable sentences

Basically a way of storing data
in generated English sentences
that should be easy to remember.
Sentence structure and vocabulary
could both be used to encode data.
Perhaps useful for sharing encryption keys?

## Hex editor

Very generic.
I was envisioning
a nice text interface
that let you add annotations
to address ranges and such.
With colour.

## Deteriorating image format

I was thinking about
how images [deteriorate][jaypeg] over time
by being shared over and over
to different sites
and being recompressed.
The idea is to make this property
part of the format itself.
Enforce that an image
cannot be displayed
without mutating the file on disk.
I'm not sure if this is at all possible,
but might be with some
really crazy proof-of-work constraint.

[jaypeg]: https://youtu.be/QEzhxP-pdos

## GitHub issues happy birthday

This seems likely to have already been done.
A bot that bumps GitHub issues
that are a year old
with a dank meme.

## Shell script package manager

A package manager
for distributing small scripts,
powered entirely by Gists.
I'm not sure why
this would be necessary,
honestly.

## Git chat

Chat client using Git as a backend.
It would have persistent logs,
conversation branching,
bookmarking,
and attachments
for free.
PGP integration would also
probably be useful.

## Editor-invoking mail client

Git rebase interactive
is my favourite terminal interface.
I want a mail client
that behaves similarly,
making use of the filesystem
and my `$EDITOR`.
No curses garbage.

## File metadata esoteric language

The most recent of my ill-fated ideas,
an esoteric language
which takes only file metadata as input.
Names for ordering and comments,
directories for structure,
links for loops.
Data could be stored in
permissions and timestamps.
Unfortunately,
not all metadata is preserved
across filesystems
or by Git.
