const math = window.math;

export function dmvnorm(x, mu, sigma) {
  // Ensure input dimensions are compatible
  if (x.length !== mu.length) {
    throw new Error('Dimension mismatch: x and mu must have the same length');
  }
  if (sigma.length !== mu.length || sigma[0].length !== mu.length) {
    throw new Error('Dimension mismatch: sigma must be a square matrix with the same length as mu');
  }

  const n = mu.length;
  const covMatrix = math.matrix(sigma);
  const detCov = math.det(covMatrix);

  // Check if the covariance matrix is singular
  if (detCov === 0) {
    throw new Error('Covariance matrix is singular');
  }

  const normalizationConstant = 1 / (Math.pow(2 * Math.PI, n / 2) * Math.sqrt(detCov));
  const diff = math.subtract(math.matrix(x), math.matrix(mu));
  const invCovMatrix = math.inv(covMatrix);
  const exponent = -0.5 * math.multiply(math.multiply(diff, invCovMatrix), diff);

  return normalizationConstant * Math.exp(exponent);
}

export function dnorm(t, mean, sd) {
  // Ensure standard deviation is positive
  if (sd <= 0) {
    throw new Error('Standard deviation must be positive');
  }

  const variance = Math.pow(sd, 2);
  const exponent = -Math.pow(t - mean, 2) / (2 * variance);
  const normalizationConstant = 1 / Math.sqrt(2 * Math.PI * variance);
  const result = normalizationConstant * Math.exp(exponent);

  return result;
}
