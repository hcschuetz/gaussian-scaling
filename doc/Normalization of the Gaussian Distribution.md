Normalization of the Gaussian Distribution
==========================================

The Gaussian Distribution with mean `μ` and standard deviation `σ` has the
probability density function
```
1/(σ√(2π)) exp(-½((x-μ)/σ)²)
```
Question: Where does the constant factor `1/(σ√(2π))` come from?

It is a normalization factor, that is,
it ensures that the integral over the function from `-∞` to `+∞` is 1.
It is obviously a requirement for probability density functions that the
integral over the entire domain must be 1
because it is 100% certain that the result of an experiment with that
distribution will be in the domain.
And "100%" is just another way to write "1".

So if we need the normalization factor `1/(σ√(2π))`,
then apparently the integral
```
∫[-∞..+∞] exp(-½((x-μ)/σ)²) dx
```
must be `σ√(2π)`.  How does this come?


Dealing with the `μ`
--------------------

First let's have a look at `μ`.
Let us compare `exp(-½((x-μ)/σ)²)` for different values of `μ`, say
0, 3, and -3.
```
a(x) := exp(-½((x-0)/σ)²) = exp(-½(x/σ)²)
b(x) := exp(-½((x-3)/σ)²)
c(x) := exp(-½((x-(-3))/σ)²) = exp(-½((x+3)/σ)²)
```

Assume that `a` has some function value `y₀` for some argument value `x₀`,
that is, `a(x₀) = y₀`.
Then `b` will reach that same value `y₀` three units farther to the right,
namely for an argument value of `x₀+3` since `b(x₀+3) = y₀`.
Similarly `c` reaches value `y₀` three units to the right of `x₀`
since `c(x₀-3) = y₀`.

So, depending on whether `μ` is positive or negative,
subtracting `μ` from `x` shifts the function graph to the right or left
compared to the graph of `a` whithout that subtraction of `μ`.

The integral over the function, that is, is the area between the function graph
and the `x` axis is unaffected by such horizontal shifts
if we consider the entire domain from `-∞` to `+∞`.

So from now on we consider the slightly simpler function `exp(-½(x/σ)²)`.


Dealing with the `σ`
--------------------

Let us now have a look at `σ` in a similar way.
We compare `exp(-½(x/σ)²)` for `σ` values of 1, 2, and ½:
```
a(x) := exp(-½(x/1)²) = exp(-½x²) 
b(x) := exp(-½(x/2)²)
c(x) := exp(-½(x/½)²) = exp(-½(2x)²)
```
When we move along the `x` axis starting at zero,
the expression `x/2` will grow half as fast as `x` does.
`2x` will grow twice as fast as `x`.

Assume again that `a` reaches some function value `y₀`
for some argument value `x₀`, that is, `a(x₀) = y₀`.
Then `b` will reach that same value `y₀` only at `2x₀`, that is, `b(2x₀) = y₀`.
Similarly `c` reaches value `y₀` already at `x₀/2`, that is, `c(x₀/2) = y₀`.

So the function graph of `b` is stretched horizontally by a factor of 2
compared to `a` while the graph of `c` is a contracted version of `a`.
Stretching or contracting by a factor obviously increases or reduces
the integral value by that same factor, again assuming that we integrate
over the entire domain from `-∞` to `+∞`.

And this is reflected by the factor `σ` in the integration result.

Now that the `σ` is explained, we simplify our expression again.
We will now just investigate `exp(-½x²)`.


What the `π`?
-------------

So we expect the integral
```
∫[-∞..+∞] exp(-½x²) dx
```
to be `√(2π)`.  What is this?

Our integral does not involve any obvious circles and yet its value
involves `π`.

About three centuries ago mathematicians were puzzling about the infinite series
```
1 + 1/4 + 1/9 + 1/16 + 1/25 + ... + 1/n² + ...
```
Since particularly mathematicians from Basel were involved
(at least one of the Bernoullis and Euler),
the problem became to be known as the "Basel problem".

In 1735 Euler finally found the solution: `π²/6`

It was a big surprise to find `π` in a result of a series that has no
obvious relation to circles.
(BTW, there is a nice video by 3blue1brown with a derivation of the value
which actually does involve circles.)

So when our integral problem was solved about half a century later
it was no more that surprising that `π` showed up in an unexpected place.


Gamification
------------

I invite you to handle this video a bit like a game show
where candidates get more and more hints about a thing they have to guess
and they have to push a buzzer when they think they know the answer.

When you think you have got sufficient hints, just stop the video
and try to solve the integral by yourself.
You may use as much time as you need for this.
What counts is the time at which you stopped the video.

You might want to report in the video how early or late in the video
you were able to find the answer by yourself.
Please notice that there is no need to cheat as there are no prizes to win.

If you cannot find the solution after stopping the video,
just continue watching and try again later with more hints.


The square
----------

The first hint is that our value `√(2π)` involves a square root.

Let us call our integral "`I`":
```
I ≔ ∫[-∞..+∞] exp(-½x²) dx
```

So if
```
I = √(2π)
```
it might make sense to work with `I²`:
```
2π = I² = (∫[-∞..+∞] exp(-½x²) dx)²
```

Half the pie
------------

BTW, I do not really like `π` that much.
It has been defined as the ratio between the perimeter and the diameter of a
circle.
It has turned out that in formulas it is far more
practical to work with the radius of a circle instead of the diameter.

(What is a circle?
The set of all points that have a given distance from a given center.
And that distance is the *radius*, not the diameter of that circle!)

And the ratio between the perimeter and the radius is `2π`.
The period of the sine and cosine function is `2π`.
This value actually shows up in lots of places in mathematics and physics.
And it also shows up in our value.

A full-turn angle in radians is `2π` while `π` is only a half turn,
that is, 180°.  As the saying goes: `π` is only half the pie.

Some mathematicians suggest to use a symbol for `2π` instead of `π`.
Among others, the Greek letter `τ` (for "turns") has been suggested for this.
Using this, `τ/4` is a quarter turn, `τ/2` is a half turn, `τ` is a full turn,
and `42τ` are 42 turns.

I'm afraid I will not change the language of mathematics with this video.
Languages are often irregular and people have always lived with that.
Nevertheless I'll use `τ` in the rest of this video to give you a feel
how it would be if we had this symbol in our vocabulary.


Back to the square
------------------

Now with our new symbol we have
```
τ = I²
  = (∫[-∞..+∞] exp(-½x²) dx)²
```
which we can transform to
```
  = (∫[-∞..+∞] exp(-½x²) dx) (∫[-∞..+∞] exp(-½x²) dx)
  = (∫[-∞..+∞] exp(-½x²) dx) (∫[-∞..+∞] exp(-½y²) dy)
  = ∫[-∞..+∞] ∫[-∞..+∞] exp(-½x²) exp(-½y²) dxdy
  = ∫[-∞..+∞] ∫[-∞..+∞] exp(-½x²-½y²) dxdy
  = ∫[-∞..+∞] ∫[-∞..+∞] exp(-½(x²+y²)) dxdy
```
Is it really easier to solve a double integral than a single one?
Well, in this case it actually is.


Squaring the circle - or actually circling the square
-----------------------------------------------------

Let's have a look at the graph of the 2-parameter function `exp(-½(x²+y²))`.
Adding these blue grid lines makes the shape a bit easier to grasp.

Notice that each of the blue lines is a bell curve,
but most of them are scaled down.

These lines are intersections of our function graph with planes that are
parallel to the `x/z` plane and to the `y/z` plane.
What about intersecting our function graph with planes
parallel to the `x/y` plane?

These green lines are like contour lines on a map.
And looking at them from the top gives yet another hint about how
`τ` (or `π`) might show up:  Yes, these are circles.

All these circles have their centers above the origin of the coordinate system.
This suggests to switch to polar coordinates - for the input values.
Or to cylindrical coordinates if we include the output values along the `z` axis.

Here we have a segmentation of the function graph based on polar/cylindrical
coordinates.

So all we have to do is to
1. compute the volumes of the segments,
2. add up all these volumes,
3. find the limit as the segmenation gets finer and finer.

Each segment is approximately a rectangular cuboid with the following sizes:
- Its base length in the radial direction is our radius step width `Δr`,
  which will become `dr` when we switch over to infinitesimal steps.
- The base length in the tangential direction is `r Δϕ`
  where `Δϕ` is our angular step width.
  Notice that the tangential base lengths get larger and larger the farther
  we get away from the center.
  When switching to infinitesimal steps the tangential base length becomes
  `r dϕ`.
- The height is the function value `exp(-½(x²+y²))`,
  which we can now write as `exp(-½r²)` where `r²=x²+y²`

Taking all this together, our segment size is
```
exp(-½r²) r dϕ dr
```
We have to sum that up for radii between `0` and `∞`
and for angles between `0` and `τ`.
(Did anybody say "`2π`"?)
```
I² = ∫[0..∞] ∫[0..τ] exp(-½r²) r dϕ dr
```
This can be nicely separated out to
```
   = (∫[0..τ] dϕ) (∫[0..∞] exp(-½r²) r dr)
```
(It is essentially the rotational symmetry of our graph
that allows us to do this.)
The first integral is just `τ`.  So we get:
```
   = τ ∫[0..∞] exp(-½r²) r dr
```
To solve this we need an antiderivative of `exp(-½r²) r`.
Fortunately a closed-form antiderivative exists.
It is simply `-exp(-½r²)` as you can easily verify by deriving this
expression using the chain rule.

So we evaluate that antiderivative at values `r = 0` and `r → ∞`.
For the former we get `-1` while for the latter we get 0.
So our expression for `I²` can be further simplified to
```
   = τ (0 - (-1))
   = τ
```
Now taking the square root on both sides gives us
```
I = √τ
```
Tadaaa!


Variations
----------

For some viewers it might be a bit unfamiliar that a side length of
an infinitesimal element is not of the form `dv` with some variable `v`.
In our integration we had `r dϕ` for the tangential side length.

We can bypass this problem by computing the volume under the graph surface
in a slightly different, more geometric way.
We consider cylinders around the `z` axis reaching from the `x/y` plane to the
graph surface.

If such a cylinder has radius `r`, the perimeter of its base circle is `τr`
and its height is `exp(-½r²)`.  Thus the cylinder side is `τr exp(-½r²)`.
Now we just need an integration over all the cylinder radii from `0` to `∞`:
```
I² = ∫[0..∞] τr exp(-½r²) dr
   = τ ∫[0..∞] r exp(-½r²) dr
```
from which we can proceed as before.

Furthermore in a paper on the web I have even found an approach
based on horizontal disks under the graph surface.
This uses the inverse of our function to compute the disk radius `r` from `z`.
We obtain the result by integrating along the `z` axis from `0` to `1`
over the disk areas `½τr²`.

TODO add link


Colophon
--------

This is by far not the first explanation of this result on the web.
Nevertheless I had the impression that a 3D visualization can help viewers to
get a better intuitive understanding of the topic.

And actually I was curious about graphics support in browsers.
I needed a toy example to try this out.

I was pleasantly surprised that tools like "react three fiber"
support quite high-level 3D modelling.
(Also ReactPixi gave a very good impression for 2D modelling.
But for this video I decided to use only one graphic system.)

Also KaTeX creates nice mathematical formulas from TeX input syntax.

My video output does not match animations like those in videos of
3blue1brown created with the "manim" library.
But:
1. With the browser-based tools I made quite a bit of headway.
2. More polishing is certainly possible.
3. Modern web development tools and the interaction with the UI are
   very helpful.
