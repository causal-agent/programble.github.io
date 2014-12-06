---
layout: post
title: A Formula for the Number of Days in Each Month
---

Recently, after being awake for longer than I should have, I started
thinking about methods of remembering the number of days in each month
of the year. There is a rhyme for it, and a way to count on your
knuckles, but these didn't satisfy me. I wondered if there was a
mathematical formula for the problem, and upon not immediately finding
one, I challenged myself to create one.

<del>Put more formally</del> In other words, the challenge was this:
find a function <i class="formula">f</i>, such that
<i class="formula">f(x)</i> is equal to the number of days in month
<i class="formula">x</i>, represented by the integers 1 through 12. Or,
as a table of values:<sup>1</sup>

<div class="row"><div class="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">
  <div class="table-responsive"><table class="table table-bordered tov">
    <thead>
      <tr>
        <th><i>x</i></th>
        <td>1</td> <td>2</td> <td>3</td> <td>4</td> <td>5</td> <td>6</td>
        <td>7</td> <td>8</td> <td>9</td> <td>10</td> <td>11</td> <td>12</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th><i>f(x)</i></th>
        <td>31</td> <td>28</td> <td>31</td> <td>30</td> <td>31</td> <td>30</td>
        <td>31</td> <td>31</td> <td>30</td> <td>31</td> <td>30</td> <td>31</td>
      </tr>
    </tbody>
  </table></div>
</div></div>

If you want to give this challenge a go before reading my solution, now
is your chance. If you'd rather see my complete solution right away,
scroll to the bottom of the page. What follows is my process for solving
the problem.

## The Tools

Firstly, here's a quick refresher on two operations I found vital to
solving the problem: floor division and modulo.

Floor division is the operation performed by many programming languages
when dividing two integer numbers, that is, the result of the division
is truncated to the integer part. I will represent floor division as
<span class="formula">&lfloor;<sup><i>a</i></sup>&frasl;<sub><i>b</i></sub>&rfloor;</span>,
for example:

<p class="formula">
  &lfloor;<sup>5</sup>&frasl;<sub>3</sub>&rfloor; = 1
</p>

Modulo is an operation that results in the remainder of a division. It
is represented in many programming languages with the `%` operator. I
will represent it as <span class="formula"><i>a</i> mod <i>b</i></span>,
for example:

<p class="formula">
  3 mod 2 = 1
</p>

Note that modulo has the same precedence as division.

## The Basics

With those tools in mind, let's get a basic pattern going.<sup>2</sup> Months
usually alternate between lengths of 30 and 31 days. We can use
<span class="formula"><i>x</i> mod 2</span> to get an alternating
pattern of 1 and 0, then just add our constant base number of days:

<p class="formula">
  <i>f(x)</i> = 30 + <i>x</i> mod 2
</p>

<div class="row"><div class="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">
  <div class="table-responsive"><table class="table table-bordered tov">
    <thead>
      <tr>
        <th><i>x</i></th>
        <td>1</td> <td>2</td> <td>3</td> <td>4</td> <td>5</td> <td>6</td>
        <td>7</td> <td>8</td> <td>9</td> <td>10</td> <td>11</td> <td>12</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th><i>f(x)</i></th>
        <td class="success">31</td> <td class="danger">30</td>
        <td class="success">31</td> <td class="success">30</td>
        <td class="success">31</td> <td class="success">30</td>
        <td class="success">31</td> <td class="danger">30</td>
        <td class="danger">31</td>  <td class="danger">30</td>
        <td class="danger">31</td>  <td class="danger">30</td>
      </tr>
    </tbody>
  </table></div>
</div></div>

That's a pretty good start! We've already got January and March through
July done. February is its own special problem we'll deal with later.
The problem after July is that the pattern should skip one, and the rest
of the months should follow the alternating pattern inversely.

To obtain an inverse pattern of alternating 0 and 1, we can add 1 to our
dividend:

<p class="formula">
  <i>f(x)</i> = 30 + (<i>x</i> + 1) mod 2
</p>

<div class="row"><div class="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">
  <div class="table-responsive"><table class="table table-bordered tov">
    <thead>
      <tr>
        <th><i>x</i></th>
        <td>1</td> <td>2</td> <td>3</td> <td>4</td> <td>5</td> <td>6</td>
        <td>7</td> <td>8</td> <td>9</td> <td>10</td> <td>11</td> <td>12</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th><i>f(x)</i></th>
        <td class="danger">30</td>  <td class="danger">31</td>
        <td class="danger">30</td>  <td class="danger">31</td>
        <td class="danger">30</td>  <td class="danger">31</td>
        <td class="danger">30</td>  <td class="success">31</td>
        <td class="success">30</td> <td class="success">31</td>
        <td class="success">30</td> <td class="success">31</td>
      </tr>
    </tbody>
  </table></div>
</div></div>

Now we have August through December right, but the rest of the year is
wrong as expected. Let's see how we can combine combine our two
formulas.

## Masking

What we need here is basically a piece-wise function, but that's just no
fun. This got me thinking of other ways to use a part of a function only
over a certain domain.

I figured the easiest way to do this would be to find an expression
equal to 1 over the desired domain and 0 otherwise. Multiplying a term
by this expression will result in the term being cancelled out outside
its domain. I've called this "masking," since it involves creating a
sort of bit-mask.

To mask the latter piece of our function, we need an expression equal to
1 where <span class="formula">8 &le; <i>x</i> &le; 12</span>. Floor
division by 8 is perfect for this, since all our values are less than
16.

<div class="row"><div class="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">
  <div class="table-responsive"><table class="table table-bordered tov">
    <thead>
      <tr>
        <th><i>x</i></th>
        <td>1</td> <td>2</td> <td>3</td> <td>4</td> <td>5</td> <td>6</td>
        <td>7</td> <td>8</td> <td>9</td> <td>10</td> <td>11</td> <td>12</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>&lfloor;<sup><i>x</i></sup>&frasl;<sub>8</sub>&rfloor;</th>
        <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td>
        <td>0</td> <td>1</td> <td>1</td> <td>1</td> <td>1</td> <td>1</td>
      </tr>
    </tbody>
  </table></div>
</div></div>

Now if we substitute this expression in our
<span class="formula"><i>x</i> + 1</span> dividend, we can invert the
pattern using our mask:

<p class="formula">
  <i>f(x)</i> = 30 + (<i>x</i> + &lfloor;<sup><i>x</i></sup>&frasl;<sub>8</sub>&rfloor;) mod 2
</p>

<div class="row"><div class="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">
  <div class="table-responsive"><table class="table table-bordered tov">
    <thead>
      <tr>
        <th><i>x</i></th>
        <td>1</td> <td>2</td> <td>3</td> <td>4</td> <td>5</td> <td>6</td>
        <td>7</td> <td>8</td> <td>9</td> <td>10</td> <td>11</td> <td>12</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th><i>f(x)</i></th>
        <td class="success">31</td> <td class="danger">30</td>
        <td class="success">31</td> <td class="success">30</td>
        <td class="success">31</td> <td class="success">30</td>
        <td class="success">31</td> <td class="success">31</td>
        <td class="success">30</td> <td class="success">31</td>
        <td class="success">30</td> <td class="success">31</td>
      </tr>
    </tbody>
  </table></div>
</div></div>

Woot! Everything is correct except February. What a surprise.

## February

Every month has either 30 or 31 days, but February has 28 (leap years
are out of scope).<sup>3</sup> February currently has 30 days according
to our formula, so an expression equal to 2 when
<span class="formula"><i>x</i> = 2</span> would be ideal for subtraction.

The best I could come up with was
<span class="formula">2 mod <i>x</i></span>, which gives us a sort of
mask over every month after February.

<div class="row"><div class="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">
  <div class="table-responsive"><table class="table table-bordered tov">
    <thead>
      <tr>
        <th><i>x</i></th>
        <td>1</td> <td>2</td> <td>3</td> <td>4</td> <td>5</td> <td>6</td>
        <td>7</td> <td>8</td> <td>9</td> <td>10</td> <td>11</td> <td>12</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>2 mod <i>x</i></th>
        <td>0</td> <td>0</td> <td>2</td> <td>2</td> <td>2</td> <td>2</td>
        <td>2</td> <td>2</td> <td>2</td> <td>2</td> <td>2</td> <td>2</td>
      </tr>
    </tbody>
  </table></div>
</div></div>

With this, we'll need to change our base constant to 28 so that adding 2
to the rest of the months will still be correct.

<p class="formula">
  <i>f(x)</i> = 28 + (<i>x</i> + &lfloor;<sup><i>x</i></sup>&frasl;<sub>8</sub>&rfloor;) mod 2 + 2 mod <i>x</i>
</p>

<div class="row"><div class="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">
  <div class="table-responsive"><table class="table table-bordered tov">
    <thead>
      <tr>
        <th><i>x</i></th>
        <td>1</td> <td>2</td> <td>3</td> <td>4</td> <td>5</td> <td>6</td>
        <td>7</td> <td>8</td> <td>9</td> <td>10</td> <td>11</td> <td>12</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th><i>f(x)</i></th>
        <td class="danger">29</td> <td class="success">28</td>
        <td class="success">31</td> <td class="success">30</td>
        <td class="success">31</td> <td class="success">30</td>
        <td class="success">31</td> <td class="success">31</td>
        <td class="success">30</td> <td class="success">31</td>
        <td class="success">30</td> <td class="success">31</td>
      </tr>
    </tbody>
  </table></div>
</div></div>

Unfortunately, January is now 2 days short. Luckily, finding an
expression that will apply to only the first month is easy: floored
inverse of <i class="formula">x</i>. Now just multiply that by 2 and we
get the final formula:

<p class="formula">
  <i>f(x)</i> = 28 + (<i>x</i> + &lfloor;<sup><i>x</i></sup>&frasl;<sub>8</sub>&rfloor;) mod 2 + 2 mod <i>x</i> + 2 &lfloor;<sup>1</sup>&frasl;<sub><i>x</i></sub>&rfloor;
</p>

<div class="row"><div class="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">
  <div class="table-responsive"><table class="table table-bordered tov">
    <thead>
      <tr>
        <th><i>x</i></th>
        <td>1</td> <td>2</td> <td>3</td> <td>4</td> <td>5</td> <td>6</td>
        <td>7</td> <td>8</td> <td>9</td> <td>10</td> <td>11</td> <td>12</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th><i>f(x)</i></th>
        <td class="success">31</td> <td class="success">28</td>
        <td class="success">31</td> <td class="success">30</td>
        <td class="success">31</td> <td class="success">30</td>
        <td class="success">31</td> <td class="success">31</td>
        <td class="success">30</td> <td class="success">31</td>
        <td class="success">30</td> <td class="success">31</td>
      </tr>
    </tbody>
  </table></div>
</div></div>

## Conclusion

*2014-12-06: Hello, Internet. This is tongue-in-cheek. Why would anyone
use this?*

There you have it, a formula for the number of days in each month using
simple arithmetic. So next time you find yourself wondering how many
days are in September, just remember to apply
<span class="formula"><i>f</i>(9)</span>. For ease of use, here's a JavaScript
one-liner:

    function f(x) { return 28 + (x + Math.floor(x/8)) % 2 + 2 % x + 2 * Math.floor(1/x); }

1. Naturally, I didn't feel like using any of the mnemonics, so I looked
   this table up on the Internet.
2. "The Basics," or, "The Rule With Many Exceptions," like most rules.
3. February was originally the last month of the year in the Roman
   calendar, so it actually makes more sense than it seems for it to be
   shorter than the others. It also makes more sense that its length
   would vary, since adding or removing a day from the end of the year
   is more intuitive.
