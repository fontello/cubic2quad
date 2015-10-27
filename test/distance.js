'use strict';

var isApproximationClose = require('../index').isApproximationClose;
var assert = require('assert');

describe('measure error of approximation and confirm that', function () {
  it('straight line is the same as a straight line (error ~ 1e-8)', function () {
    assert(isApproximationClose(0, 0, 10, 10, 20, 20, 30, 30,
        [ 0, 0, 15, 15, 30, 30 ], 1e-8));
  });
  it('two parallel lines (distance between is 0.01) are not same (error ~ 1e-8)', function () {
    assert(!isApproximationClose(0, 0, 10, 0, 20, 0, 30, 0,
        [ 0, 0.01, 15, 0.01, 30, 0.01 ], 1e-8));
  });
  it('two parallel lines (distance between is 0.01) are same (error 0.1)', function () {
    assert(isApproximationClose(0, 0, 10, 0, 20, 0, 30, 0,
        [ 0, 0.01, 15, 0.01, 30, 0.01 ], 0.1));
  });
  it('actually quadratic curve is the same as converted (error ~ 1e-8)', function () {
    assert(isApproximationClose(0, 0, 10, 10, 20, 10, 30, 0,
        [ 0, 0, 15, 15, 30, 0 ], 1e-8));
  });
  it('two quadratic curves (distance between CP is 0.01) are not same (error ~ 1e-8)', function () {
    assert(!isApproximationClose(0, 0, 10, 10, 20, 10, 30, 0,
        [ 0, 15, 15.01, 30, 0 ], 1e-8));
  });
  it('two quadratic curves (distance between CP is 0.01) are same (error ~ 0.1)', function () {
    assert(isApproximationClose(0, 0, 10, 10, 20, 10, 30, 0,
        [ 0, 0, 15, 15.01, 30, 0 ], 0.1));
  });
});
