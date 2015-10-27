#!/usr/bin/env node
'use strict';

/* eslint-disable no-console */

var Benchmark = require('benchmark');
var cubic2quad = require('../index');

var suite = new Benchmark.Suite('bezier-approx');

suite
.add('cubic2quad (straight line given)', function () {
  cubic2quad(0, 0, 10, 0, 20, 0, 30, 0, 1e-3);
})
.add('cubic2quad (quadratic curve given)', function () {
  cubic2quad(0, 0, 10, 10, 20, 10, 30, 0, 1e-3);
})
.add('cubic2quad (cubic curve given, approx with 1 segment)', function () {
  cubic2quad(0, 0, 0, -22.281, 3.469, -43.469, 8.312, -64, 0.3);
})
.add('cubic2quad (cubic curve given, approx with 4 segments)', function () {
  cubic2quad(256, 384, 256, 384, 128, 384, 128, 512, 0.3);
})
.add('cubic2quad (cubic curve given, approx with 8 segments)', function () {
  cubic2quad(768, 256, 768, 256, 1024, 256, 1024, 512, 0.3);
})
.on('cycle', function (event) {
  console.log(String(event.target));
})
.run();

