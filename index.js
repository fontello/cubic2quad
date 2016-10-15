'use strict';

function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.add = function (point) {
  return new Point(this.x + point.x, this.y + point.y);
};

Point.prototype.sub = function (point) {
  return new Point(this.x - point.x, this.y - point.y);
};

Point.prototype.mul = function (value) {
  return new Point(this.x * value, this.y * value);
};

Point.prototype.div = function (value) {
  return new Point(this.x / value, this.y / value);
};

Point.prototype.dist = function () {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

Point.prototype.sqr = function () {
  return this.x * this.x + this.y * this.y;
};

Point.prototype.dot = function (point) {
  return this.x * point.x + this.y * point.y;
};

function calcPowerCoefficients(p1, c1, c2, p2) {
  // point(t) = p1*(1-t)^3 + c1*t*(1-t)^2 + c2*t^2*(1-t) + p2*t^3 = a*t^3 + b*t^2 + c*t + d
  // for each t value, so
  // a = (p2 - p1) + 3 * (c1 - c2)
  // b = 3 * (p1 + c2) - 6 * c1
  // c = 3 * (c1 - p1)
  // d = p1
  var a = p2.sub(p1).add(c1.sub(c2).mul(3));
  var b = p1.add(c2).mul(3).sub(c1.mul(6));
  var c = c1.sub(p1).mul(3);
  var d = p1;
  return [ a, b, c, d ];
}

function calcPoint(a, b, c, d, t) {
  // a*t^3 + b*t^2 + c*t + d = ((a*t + b)*t + c)*t + d
  return a.mul(t).add(b).mul(t).add(c).mul(t).add(d);
}

function calcPointQuad(a, b, c, t) {
  // a*t^2 + b*t + c = (a*t + b)*t + c
  return a.mul(t).add(b).mul(t).add(c);
}

function calcPointDerivative(a, b, c, d, t) {
  // d/dt[a*t^3 + b*t^2 + c*t + d] = 3*a*t^2 + 2*b*t + c = (3*a*t + 2*b)*t + c
  return a.mul(3 * t).add(b.mul(2)).mul(t).add(c);
}

function quadSolve(a, b, c) {
  // a*x^2 + b*x + c = 0
  if (a === 0) {
    return (b === 0) ? [] : [ -c / b ];
  }
  var D = b * b - 4 * a * c;
  if (D < 0) {
    return [];
  } else if (D === 0) {
    return [ -b / (2 * a) ];
  }
  var DSqrt = Math.sqrt(D);
  return [ (-b - DSqrt) / (2 * a), (-b + DSqrt) / (2 * a) ];
}

function cubicRoot(x) {
  return (x < 0) ? -Math.pow(-x, 1 / 3) : Math.pow(x, 1 / 3);
}

function cubicSolve(a, b, c, d) {
  // a*x^3 + b*x^2 + c*x + d = 0
  if (a === 0) {
    return quadSolve(b, c, d);
  }
  // solve using Cardan's method, which is described in paper of R.W.D. Nickals
  // http://www.nickalls.org/dick/papers/maths/cubic1993.pdf (doi:10.2307/3619777)
  var xn = -b / (3 * a); // point of symmetry x coordinate
  var yn = ((a * xn + b) * xn + c) * xn + d; // point of symmetry y coordinate
  var deltaSq = (b * b - 3 * a * c) / (9 * a * a); // delta^2
  var hSq = 4 * a * a * Math.pow(deltaSq, 3); // h^2
  var D3 = yn * yn - hSq;
  if (D3 > 0) { // 1 real root
    var D3Sqrt = Math.sqrt(D3);
    return [ xn + cubicRoot((-yn + D3Sqrt) / (2 * a)) + cubicRoot((-yn - D3Sqrt) / (2 * a)) ];
  } else if (D3 === 0) { // 2 real roots
    var delta1 = cubicRoot(yn / (2 * a));
    return [ xn - 2 * delta1, xn + delta1 ];
  }
  // 3 real roots
  var theta = Math.acos(-yn / Math.sqrt(hSq)) / 3;
  var delta = Math.sqrt(deltaSq);
  return [
    xn + 2 * delta * Math.cos(theta),
    xn + 2 * delta * Math.cos(theta + Math.PI * 2 / 3),
    xn + 2 * delta * Math.cos(theta + Math.PI * 4 / 3)
  ];
}

function minDistanceToQuad(point, p1, c1, p2) {
  // f(t) = (1-t)^2 * p1 + 2*t*(1 - t) * c1 + t^2 * p2 = a*t^2 + b*t + c, t in [0, 1],
  // a = p1 + p2 - 2 * c1
  // b = 2 * (c1 - p1)
  // c = p1; a, b, c are vectors because p1, c1, p2 are vectors too
  // The distance between given point and quadratic curve is equal to
  // sqrt((f(t) - point)^2), so these expression has zero derivative by t at points where
  // (f'(t), (f(t) - point)) = 0.
  // Substituting quadratic curve as f(t) one could obtain a cubic equation
  // e3*t^3 + e2*t^2 + e1*t + e0 = 0 with following coefficients:
  // e3 = 2 * a^2
  // e2 = 3 * a*b
  // e1 = (b^2 + 2 * a*(c - point))
  // e0 = (c - point)*b
  // One of the roots of the equation from [0, 1], or t = 0 or t = 1 is a value of t
  // at which the distance between given point and quadratic Bezier curve has minimum.
  // So to find the minimal distance one have to just pick the minimum value of
  // the distance on set {t = 0 | t = 1 | t is root of the equation from [0, 1] }.

  var a = p1.add(p2).sub(c1.mul(2));
  var b = c1.sub(p1).mul(2);
  var c = p1;
  var e3 = 2 * a.sqr();
  var e2 = 3 * a.dot(b);
  var e1 = (b.sqr() + 2 * a.dot(c.sub(point)));
  var e0 = c.sub(point).dot(b);
  var candidates = cubicSolve(e3, e2, e1, e0).filter(function (t) { return t > 0 && t < 1; }).concat([ 0, 1 ]);

  var minDistance = 1e9;
  for (var i = 0; i < candidates.length; i++) {
    var distance = calcPointQuad(a, b, c, candidates[i]).sub(point).dist();
    if (distance < minDistance) {
      minDistance = distance;
    }
  }
  return minDistance;
}


function processSegment(a, b, c, d, t1, t2) {
  // Find a single control point for given segment of cubic Bezier curve
  // These control point is an interception of tangent lines to the boundary points
  // Let's denote that f(t) is a vector function of parameter t that defines the cubic Bezier curve,
  // f(t1) + f'(t1)*z1 is a parametric equation of tangent line to f(t1) with parameter z1
  // f(t2) + f'(t2)*z2 is the same for point f(t2) and the vector equation
  // f(t1) + f'(t1)*z1 = f(t2) + f'(t2)*z2 defines the values of parameters z1 and z2.
  // Defining fx(t) and fy(t) as the x and y components of vector function f(t) respectively
  // and solving the given system for z1 one could obtain that
  //
  //      -(fx(t2) - fx(t1))*fy'(t2) + (fy(t2) - fy(t1))*fx'(t2)
  // z1 = ------------------------------------------------------.
  //            -fx'(t1)*fy'(t2) + fx'(t2)*fy'(t1)
  //
  // Let's assign letter D to the denominator and note that if D = 0 it means that the curve actually
  // is a line. Substituting z1 to the equation of tangent line to the point f(t1), one could obtain that
  // cx = [fx'(t1)*(fy(t2)*fx'(t2) - fx(t2)*fy'(t2)) + fx'(t2)*(fx(t1)*fy'(t1) - fy(t1)*fx'(t1))]/D
  // cy = [fy'(t1)*(fy(t2)*fx'(t2) - fx(t2)*fy'(t2)) + fy'(t2)*(fx(t1)*fy'(t1) - fy(t1)*fx'(t1))]/D
  // where c = (cx, cy) is the control point of quadratic Bezier curve.

  var f1 = calcPoint(a, b, c, d, t1);
  var f2 = calcPoint(a, b, c, d, t2);
  var f1_ = calcPointDerivative(a, b, c, d, t1);
  var f2_ = calcPointDerivative(a, b, c, d, t2);

  var D = -f1_.x * f2_.y + f2_.x * f1_.y;
  if (Math.abs(D) < 1e-8) {
    return [ f1, f1.add(f2).div(2), f2 ]; // straight line segment
  }
  var z1 = (f2_.y * f1.x - f2_.x * f1.y - f2_.y * f2.x + f2_.x * f2.y) / D;
  var z2 = (f1_.y * f1.x - f1_.x * f1.y - f1_.y * f2.x + f1_.x * f2.y) / D;
  if (z1 < 0 || z2 > 0) {
    return [ f1, f1.add(f2).div(2), f2 ];
  }
  return [ f1, f1.add(f1_.mul(z1)), f2 ];
}

function isSegmentApproximationClose(a, b, c, d, tmin, tmax, p1, c1, p2, errorBound) {
  // a,b,c,d define cubic curve
  // tmin, tmax are boundary points on cubic curve
  // p1, c1, p2 define quadratic curve
  // errorBound is maximum allowed distance
  // Try to find maximum distance between one of N points segment of given cubic
  // and corresponding quadratic curve that estimates the cubic one, assuming
  // that the boundary points of cubic and quadratic points are equal.
  //
  // The distance calculation method comes from Hausdorff distance defenition
  // (https://en.wikipedia.org/wiki/Hausdorff_distance), but with following simplifications
  // * it looks for maximum distance only for finite number of points of cubic curve
  // * it doesn't perform reverse check that means selecting set of fixed points on
  //   the quadratic curve and looking for the closest points on the cubic curve
  // But this method allows easy estimation of approximation error, so it is enough
  // for practical purposes.

  var n = 10; // number of points + 1
  var dt = (tmax - tmin) / n;
  for (var i = 0; i <= n; i++) { // don't check distance on boundary points
    var t = tmin + (tmax - tmin) * (i / n);
    // because they should be the same
    var point = calcPoint(a, b, c, d, t);
    if (minDistanceToQuad(point, p1, c1, p2) > errorBound) {
      return false;
    }
  }
  return true;
}

function _isApproximationClose(a, b, c, d, quadCurves, ts, errorBound) {
  for (var i = 0; i < quadCurves.length; i++) {
    var p1 = quadCurves[i][0];
    var c1 = quadCurves[i][1];
    var p2 = quadCurves[i][2];
    if (!isSegmentApproximationClose(a, b, c, d, ts[i], ts[i + 1], p1, c1, p2, errorBound)) {
      return false;
    }
  }
  return true;
}

function fromFlatArray(points) {
  var result = [];
  var segmentsNumber = (points.length - 2) / 4;
  for (var i = 0; i < segmentsNumber; i++) {
    result.push([
      new Point(points[4 * i], points[4 * i + 1]),
      new Point(points[4 * i + 2], points[4 * i + 3]),
      new Point(points[4 * i + 4], points[4 * i + 5])
    ]);
  }
  return result;
}

function toFlatArray(quadsList) {
  var result = [];
  result.push(quadsList[0][0].x);
  result.push(quadsList[0][0].y);
  for (var i = 0; i < quadsList.length; i++) {
    result.push(quadsList[i][1].x);
    result.push(quadsList[i][1].y);
    result.push(quadsList[i][2].x);
    result.push(quadsList[i][2].y);
  }
  return result;
}

function isApproximationClose(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, quads, errorBound, _ts) {
  // TODO: rewrite it in C-style and remove _isApproximationClose
  var ts = [ 0 ];
  for (var j = 0; j < quads.length; j++) {
    ts.push((j + 1) / quads.length);
  }
  var pc = calcPowerCoefficients(
    new Point(p1x, p1y),
    new Point(c1x, c1y),
    new Point(c2x, c2y),
    new Point(p2x, p2y)
  );
  return _isApproximationClose(pc[0], pc[1], pc[2], pc[3], fromFlatArray(quads), _ts || ts, errorBound);
}

function VALID(t) { return t > 0 && t < 1; }
function solveInflections(x1, y1, x2, y2, x3, y3, x4, y4) {
  var p = -(x4 * (y1 - 2 * y2 + y3)) + x3 * (2 * y1 - 3 * y2 + y4)
    + x1 * (y2 - 2 * y3 + y4) - x2 * (y1 - 3 * y3 + 2 * y4);
  var q = x4 * (y1 - y2) + 3 * x3 * (-y1 + y2) + x2 * (2 * y1 - 3 * y3 + y4) - x1 * (2 * y2 - 3 * y3 + y4);
  var r = x3 * (y1 - y2) + x1 * (y2 - y3) + x2 * (-y1 + y3);
  return quadSolve(p, q, r).filter(VALID);
}


/*
 * Approximate cubic Bezier curve defined with base points p1, p2 and control points c1, c2 with
 * with a few quadratic Bezier curves.
 * The function uses tangent method to find quadratic approximation of cubic curve segment and
 * simplified Hausdorff distance to determine number of segments that is enough to make error small.
 * In general the method is the same as described here: https://fontforge.github.io/bezier.html.
 */
function _cubicToQuad(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, errorBound) {
  var p1 = new Point(p1x, p1y);
  var c1 = new Point(c1x, c1y);
  var c2 = new Point(c2x, c2y);
  var p2 = new Point(p2x, p2y);
  var pc = calcPowerCoefficients(p1, c1, c2, p2);
  var a = pc[0], b = pc[1], c = pc[2], d = pc[3];

  var inflectionTs = solveInflections(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y);
  // console.log(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, inflectionTs);
  var ts;
  var approximation;
  for (var segmentsCount = 1; segmentsCount <= 8; segmentsCount++) {
    ts = [ 0 ];
    var inflectionJ = 0;
    for (var n = 0; n < segmentsCount; n++) {
      var t = (n + 1) / segmentsCount;
      if (inflectionJ < inflectionTs.length && t > inflectionTs[inflectionJ]) {
        ts.push(inflectionTs[inflectionJ]);
        inflectionJ += 1;
      }
      ts.push(t);
    }
    approximation = [];
    for (var j = 0; j < ts.length - 1; j++) {
      approximation.push(processSegment(a, b, c, d, ts[j], ts[j + 1]));
    }
    if (segmentsCount === 1 && (
      approximation[0][1].sub(p1).dot(c1.sub(p1)) < 0 ||
      approximation[0][1].sub(p2).dot(c2.sub(p2)) < 0)) {
      // approximation concave, while the curve is convex (or vice versa)
      continue;
    }
    if (_isApproximationClose(a, b, c, d, approximation, ts, errorBound)) {
      break;
    }
  }
  return {
    quads: toFlatArray(approximation),
    ts: ts
  };
}

function cubicToQuad(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, errorBound) {
  return _cubicToQuad(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, errorBound).quads;
}

module.exports = cubicToQuad;
// following exports are for testing purposes
module.exports.isApproximationClose = isApproximationClose;
module.exports._cubicToQuad = _cubicToQuad;
module.exports.cubicSolve = cubicSolve;
