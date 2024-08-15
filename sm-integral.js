'use strict';
class Integral {
  constructor() {
    this._fastPowerCache = {};
  }

  // pass in function, lower bound, upper bound, order of error
  // for romberg, order of accuracy n has error is O(h^(2n)) where h=(b-a)/2^n
  // bounds can be numbers and/or "-inf"/"inf"

  // default order of accuracy is 18

  integrate(f, a, b, e = 18) {
    // checking for TypeError
    if (typeof a !== 'number' && a !== 'inf' && a !== '-inf') {
      throw new TypeError('<a> must be a number or "inf"/"-inf".');
    }
    if (typeof b !== 'number' && b !== 'inf' && b !== '-inf') {
      throw new TypeError('<b> must be a number or "inf"/"-inf".');
    }
    if (!Number.isInteger(e)) {
      throw new TypeError('<e> must be an integer.');
    }
    if (a === '-inf' || b === 'inf') return this._rombergImproper(f, a, b, e);
    else return this._rombergDefinite(f, a, b, e);
  }

  // calculate x^y in O(log(y)) time
  _fastPower(x, y) {
    const key = `${x},${y}`;
    if (this._fastPowerCache[key] !== undefined) {
      return this._fastPowerCache[key];
    }
    if (y === 0) return 1;
    let sol = 1;
    while (y !== 0) {
      if (y % 2 === 1) {
        sol *= x;
        y--;
        continue;
      }
      x = x * x;
      y = parseInt(y / 2);
    }
    this._fastPowerCache[key] = sol;
    return sol;
  }

  _rombergDefinite(f, a, b, e) {
    // check for edge case of 0
    if (a === b) {
      return 0;
    }
    if (a === 0) {
      a = 1e-100 * (b / Math.abs(b));
    }
    if (b === 0) {
      b = 1e-100 * (a / Math.abs(a));
    }
    // e must be even
    if (e % 2 !== 0) {
      e++;
    }
    // initialize h
    let h = b - a;
    // initialize flag for a flip array
    let flag = 1;
    // initialize the flip array
    const table = Array.from({ length: 2 }, () => new Array(e / 2 + 1));
    table[0][1] = 4;
    for (let i = 1; i <= e / 2; i++) {
      // switch state
      flag = ~flag & 1;
      // Simpson's rule
      table[flag][1] = (f(a) + f(b)) * h / 2;
      if (i !== 1) {
        table[flag][1] = table[~flag & 1][1] / 2;
        const upperBound = this._fastPower(2, i - 2);
        try {
          for (let j = 1; j <= upperBound; j++) {
            table[flag][1] += h * f(a + (2 * j - 1) * h);
          }
        } catch (err) {
          console.log('Likely error occurred due to faulty function. Consider checking domain.');
          throw err;
        }
      }
      for (let j = 2; j <= i; j++) {
        table[flag][j] = table[flag][j - 1] + (table[flag][j - 1] - table[~flag & 1][j - 1]) / (this._fastPower(4, j - 1) - 1);
      }
      h /= 2;
    }
    return table[flag][e / 2];
  }

  _rombergImproper(f, a, b, e) {
    // g(x) = f(1/x)*(-1/x^2)
    function g(x) {
      return f(1 / x) * (-1 / (x * x));
    }
    let invert = false;
    if (a !== b && (a === 'inf' || b === '-inf')) invert = true;
    if (a === '-inf' && b === 'inf') {
      if (invert) {
        return -(this._rombergDefinite(f, -1, 1, e) + this._rombergDefinite(g, 0, -1, e) + this._rombergDefinite(g, 1, 0, e));
      }
      return this._rombergDefinite(f, -1, 1, e) + this._rombergDefinite(g, 0, -1) + this._rombergDefinite(g, 1, 0, e);
    } else {
      if (a === '-inf') {
        let newBound = b - 1;
        if (newBound === 0) newBound--;
        const approxZero = 1e-100 * (newBound / Math.abs(newBound));
        if (invert) {
          return -(this._rombergDefinite(f, newBound, b, e) + this._rombergDefinite(g, approxZero, 1 / newBound, e));
        }
        return this._rombergDefinite(f, newBound, b, e) + this._rombergDefinite(g, approxZero, 1 / newBound, e);
      }
      if (b === 'inf') {
        let newBound = a + 1;
        if (newBound === 0) newBound++;
        const approxZero = 1e-100 * (newBound / Math.abs(newBound));
        if (invert) return -(this._rombergDefinite(f, a, newBound, e) + this._rombergDefinite(g, 1 / newBound, approxZero, e));
        return this._rombergDefinite(f, a, newBound, e) + this._rombergDefinite(g, 1 / newBound, approxZero, e);
      }
    }
  }
}

export default new Integral();