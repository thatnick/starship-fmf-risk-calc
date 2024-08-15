import { dmvnorm, dnorm } from "./stats-funcs.js";
import { markers } from "./post-inputs.js";
import Integral from "./sm-integral.js";

export function calcPostRisk(
  currentGestAge,
  targetGestAge,
  priorMean,
  priorSD,
  MoMs,
  sigma
) {
  const meanVector = calcMeanVector(currentGestAge, markers);
  const numerator = Integral.integrate(
    postProbDensity,
    currentGestAge,
    targetGestAge
  );
  const denominator = Integral.integrate(
    postProbDensity,
    currentGestAge,
    "inf"
  );
  function postProbDensity(gestAge) {
    // I think i might be supposed to pass calcMeanVector(gestAge, markers) into dmvnorm
    // NOT meanVector
    // const dmvnormVal = dmvnorm(MoMs, calcMeanVector(gestAge, markers), sigma);
    // const dmvnormVal = dmvnorm(MoMs, meanVector, sigma);
    // const dnormVal = dnorm(currentGestAge, priorMean, priorSD);
    // return dmvnormVal * dnormVal;
    console.log("postProbDensity:", { gestAge, priorMean, priorSD });
    const dnormVal = dnorm(gestAge, priorMean, priorSD);
    console.log("dnorm:", { dnormVal });
    
    return dnormVal;
  }
  console.log("calcPostRisk:", {
    currentGestAge,
    targetGestAge,
    priorMean,
    priorSD,
    MoMs,
    sigma,
    meanVector,
    numerator,
    denominator,
  });
  console.log("numerator, denominator:", numerator,  denominator);
  
  return numerator / denominator; // return as a proportion
}

export function calcMeanVector(gestAge, markers) {
  const meanVector = [];
  for (const key in markers) {
    const { b0, b1 } = markers[key];
    const threshold = -b0 / b1;
    if (gestAge < threshold) {
      meanVector.push(b0 + b1 * gestAge);
    } else {
      meanVector.push(0);
    }
  }

  return meanVector;
}

