---
title: Writing mdoc — semantic markup
discussions:
  - site: Lobsters
    href: https://lobste.rs/s/r94cd7/writing_mdoc_semantic_markup
---

<ins>
This post is a mirror of <https://text.causal.agency/002-writing-mdoc.txt>.
</ins>

I recently learned how to write man pages
so that I could document
a bunch of little programs I've written.
Modern man pages are written in
mdoc(7),
whose documentation is also available from
[http://mandoc.bsd.lv](http://mandoc.bsd.lv).

mdoc(7)
differs from many other markup languages
by providing
"semantic markup"
rather than just
"physical markup."
What this means is that
the markup indicates what something is,
not how to format it.
For example,
the
'`Ar`'
macro is used to indicate
command-line arguments
rather than one of the macros
for bold, italic or underline.
This frees each author of having to choose
and enables consistent presentation
across different man pages.

Another advantage of semantic markup
is that information can be extracted from it.
For example,
makewhatis(8)
can easily extract the name and short description
from each man page
thanks to the
'`Nm`'
and
'`Nd`'
macros.
I use the same information
to generate an Atom feed for these documents,
though in admittedly a much less robust way than
mandoc(1).

When it comes to actually writing
mdoc(7),
it can take some getting used to.
The language is of
roff(7)
lineage
so its syntax is very particular.
Macros cannot appear inline,
but must start on new lines
beginning with
'`.`'.
Sentences should likewise
always start on a new line.
Since I'm in the habit of writing with
semantic line breaks,
I actually find these requirements
fit in well.

The more frustrating syntax limitation to me
is the rule against empty lines.
Without them,
it can be quite difficult to edit a lengthy document.
Thankfully,
lines with only a
'`.`'
on them are allowed,
but this still causes visual noise.
To alleviate that,
I have a
vim(1)
syntax file for
mdoc(7)
which conceals the lone dots:

	if exists("b:current_syntax")
		finish
	endif
	
	runtime! syntax/nroff.vim
	unlet! b:current_syntax
	
	setlocal sections+=ShSs
	syntax match mdocBlank /^\.$/ conceal
	setlocal conceallevel=2
	
	let b:current_syntax = "mdoc"

It also adds the
mdoc(7)
section header and subsection header macros to the
**sections**
option to make
vim(1)'s
**{**
and
**}**
motions
aware of them.

With that,
I've found writing man pages pleasant and rewarding.
I've started writing other documents with
mdoc(7)
as well,
as you can see here.

### See also

[Semantic Linefeeds](http://rhodesmill.org/brandon/2012/one-sentence-per-line/)
