function gammaSample(alpha) {
  if (alpha < 1) {
    return gammaSample(alpha + 1) * Math.pow(Math.random(), 1 / alpha);
  }
  const d = alpha - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  while (true) {
    let z, v;
    do {
      const u1 = Math.random();
      const u2 = Math.random();
      z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2); // Box-Muller normal
      v = 1 + c * z;
    } while (v <= 0);
    v = v * v * v;
    const u = Math.random();
    if (u < 1 - 0.0331 * z * z * z * z) return d * v;
    if (Math.log(u) < 0.5 * z * z + d * (1 - v + Math.log(v))) return d * v;
  }
}

function betaSample(alpha, beta) {
  const x = gammaSample(alpha);
  const y = gammaSample(beta);
  return x / (x + y);
}

// Test 1000 samples
let sum = 0;
const a = 10, b = 40;
for (let i = 0; i < 1000; i++) {
  sum += betaSample(a, b);
}
console.log('Sampled Mean Beta(10, 40):', (sum / 1000).toFixed(4), 'Expected:', (a / (a + b)).toFixed(4));
