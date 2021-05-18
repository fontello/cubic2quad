/*'use strict';

var cubicSolve = require('../index').cubicSolve;
var assert = require('assert');

function floatsClose(a, b) {
  return Math.abs(a - b) < 1e-15;
}

describe('cubic equation solver', function () {
  it('equation with zero coefficients', function () {
    var roots = cubicSolve(0, 0, 0, 0);
    assert.strictEqual(roots.length, 0);
  });
  it('linear equation', function () {
    var roots = cubicSolve(0, 0, 1, -1);
    assert.strictEqual(roots.length, 1);
    assert.strictEqual(roots[0], 1);
  });
  it('quadratic equation with no real roots', function () {
    var roots = cubicSolve(0, 1, 2, 2);
    assert.strictEqual(roots.length, 0);
  });
  it('quadratic equation with one real root', function () {
    var roots = cubicSolve(0, 1, 2, 1);
    assert.strictEqual(roots.length, 1);
    assert(floatsClose(roots[0], -1));
  });
  it('quadratic equation with two real roots', function () {
    var roots = cubicSolve(0, 1, 1, 0).sort();
    assert.strictEqual(roots.length, 2);
    assert(floatsClose(roots[0], -1));
    assert(floatsClose(roots[1], 0));
  });
  it('cubic equation with one real root', function () {
    var roots = cubicSolve(1, 0, 0, 1);
    assert.strictEqual(roots.length, 1);
    assert(floatsClose(roots[0], -1));
  });
  it('cubic equation with two real roots', function () {
    var roots = cubicSolve(1, 1, 0, 0).sort();
    assert.strictEqual(roots.length, 2);
    assert(floatsClose(roots[0], -1));
    assert(floatsClose(roots[1], 0));
  });
  it('cubic equation with three real roots', function () {
    var roots = cubicSolve(1, 0, -1, 0).sort();
    assert.strictEqual(roots.length, 3);
    assert(floatsClose(roots[0], -1));
    assert(floatsClose(roots[1], 0));
    assert(floatsClose(roots[2], 1));
  });
});*/
