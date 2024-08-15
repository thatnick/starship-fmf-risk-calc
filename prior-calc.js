export const priorSD = 6.8833;

export function calcPriorMean(priorCoeffs, inputs) {
  let priorMean = priorCoeffs.constant; // Start with the constant term

  for (const key in priorCoeffs) {
    if (priorCoeffs.hasOwnProperty(key) && key !== "constant") {
      if (typeof priorCoeffs[key] !== 'number') {
        return NaN;
      }
      if (typeof inputs[key] !== 'number' && inputs[key] !== undefined) {
        return NaN;
      }
      console.log(`**** ${key} **** `);
      console.log(`priorCoeffs[${key}]: `, priorCoeffs[key]);
      console.log(`inputs[${key}]:` , inputs[key]);

      console.log(`coeff*input for ${key}:`, priorCoeffs[key] * (inputs[key]));
      priorMean += priorCoeffs[key] * (inputs[key] || 0);
      console.log(`priorMean after ${key}:`, priorMean);
      
    }
  }
  return priorMean;
}
