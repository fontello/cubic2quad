cubic2quad
==========

[![Build Status](https://img.shields.io/travis/fontello/cubic2quad/master.svg?style=flat)](https://travis-ci.org/fontello/cubic2quad)
[![NPM version](https://img.shields.io/npm/v/cubic2quad.svg?style=flat)](https://www.npmjs.org/package/cubic2quad)
[![Coverage Status](https://img.shields.io/coveralls/fontello/cubic2quad/master.svg?style=flat)](https://coveralls.io/r/fontello/cubic2quad?branch=master)

Aproximates cubic Bezier curves with quadratic ones.

Algorithm
---------
The algorithm it uses is following: 
 * split quadratic curve into _k_ segments
 * approximate each segment with tangents intersection approach (see [picture](http://www.timotheegroleau.com/Flash/articles/cubic_bezier/quadratic_on_cubic_1.gif))
 * check is the approximation good enough evaluating distance between cubic segment and quadratic approximation in 10 points and using the largest distance as an error
 * if the error is small enough stop, otherwise increase _k_ and repeat until _k_ exceeds maximum number of segments

Usage
-----
```js
var cubic2quad = require('cubic2quad');
var quads = cubic2quad(0, 0, 10, 9, 20, 11, 30, 0, 0.1);
```

It converts given quadratic curve to a number of quadratic ones. The structure of output array is following:

    [ P1x, P1y, C1x, C1y, P2x, P2y, C2x, C2y, ..., Cnx, Cny, P{n+1}x, P{n+1}y ]

where _Pi_ are base points and _Ci_ are control points.

Authors
-------

- Alexander Rodin - [@a-rodin](https://github.com/a-rodin)
- Vitaly Puzrin - [@puzrin](https://github.com/puzrin)

License
-------

[MIT](https://github.com/fontello/cubic2quad/blob/master/LICENSE)
