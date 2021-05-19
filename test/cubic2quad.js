'use strict'

var cubic2quad = require('../index')
var assert = require('assert')

describe('convert cubic Bezier curve to a number of quadratic ones', function () {
  it('straight line to the same straight line (error ~ 1e-8)', function () {
    var converted = cubic2quad(0, 0, 10, 10, 20, 20, 30, 30, 1e-8)
    assert(converted.length === 6)
    assert(converted[0] === 0 && converted[1] === 0,
      converted[2] === 15 && converted[3] === 15 &&
      converted[4] === 30 && converted[5] === 30)
  })
  it('quadratic curve to the same quadratic curve (error ~ 1e-8)', function () {
    var converted = cubic2quad(0, 0, 10, 10, 20, 10, 30, 0, 1e-8)
    assert(converted.length === 6)
    assert(converted[0] === 0 && converted[1] === 0 &&
      converted[2] === 15 && converted[3] === 15 &&
      converted[4] === 30 && converted[5] === 0)
  })
  it('cubic curve that is close to quadratic to a quadratic one (error ~ 0.1)', function () {
    // real error is 0.1, but our approximation increases error to 0.15
    var converted = cubic2quad(0, 0, 10, 9, 20, 11, 30, 0, 0.15)
    assert(converted.length === 6)
  })
  it('should be able to handle inflections (error ~ 0.5)', function () {
    var src = [858, -113, 739, -68, 624, -31, 533, 0]
    var converted = cubic2quad(src[0], src[1], src[2], src[3],
      src[4], src[5], src[6], src[7], 0.5)
    // All points should be in the bounding box of the source curve
    for (var j = 0; j < converted.length; j += 2) {
      assert(converted[j] <= src[0])
      assert(converted[j] >= src[6])
      assert(converted[j + 1] >= src[1])
      assert(converted[j + 1] <= src[7])
    }
  })
  it('should split curve at inflection point', function () {
    var src = [0, 100, 70, 0, 30, 0, 100, 100]
    var converted = cubic2quad(src[0], src[1], src[2], src[3],
      src[4], src[5], src[6], src[7], 1000)
    // 1st inflection point
    assert.equal(converted[4].toFixed(2), '34.33')
    assert.equal(converted[5].toFixed(2), '45.45')
    // 2nd inflection point
    assert.equal(converted[8].toFixed(2), '65.67')
    assert.equal(converted[9].toFixed(2), '45.45')
  })
  it('cubic curve have to be converted to two or more quads for large errorBound (error ~ 100)', function () {
    var src = [0, 0, -5, 10, 35, 10, 30, 0]
    var converted = cubic2quad(src[0], src[1], src[2], src[3],
      src[4], src[5], src[6], src[7], 100)
    assert(converted.length > 6)
  })
})
