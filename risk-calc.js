import { postForm, sigma } from "./post-inputs.js";
import { priorForm, priorCoeffs } from "./prior-inputs.js";
import { calcPriorMean, priorSD } from "./prior-calc.js";
import { calcPostRisk } from "./post-calc.js";

/*
 **
 ** FMF competing risk approach algorithm for prediction of PE
 **
 */

window.calcRisk = calcRisk;
const TARGET_GEST_AGE = 37; // assuming we want the risk up to 37 weeks

function calcRisk() {
  const currentGestAge = calcGestAge();
  
  // TODO handle prior risk only calculation
  const risk = calcPostRisk(
    currentGestAge,
    TARGET_GEST_AGE,
    calcPriorMean(priorCoeffs, priorForm),
    priorSD,
    [postForm.mapMoM, postForm.utaPiMoM, postForm.plgfMoM],
    sigma
  );
  console.log('risk:', { risk });
  if (isNaN(risk)) {
    console.error("Risk calculation resulted in NaN");
    document.getElementById("result").textContent =
      "Error in risk calculation.";
  } else {
    const odds = riskToOdds(risk);
    document.getElementById(
      "result"
    ).textContent = `Predicted Risk of Preeclampsia: 1 in ${odds}`;
  }
}

function calcGestAge() {
  // TODO we should calculate the actual current gestation age, not use a constant
  const gestAge = 12;
  return Math.max(gestAge, 24); // assuming the current gestational age is 12 weeks (the max allowed is 24)
}

function riskToOdds(risk) {  
  return Math.round(risk / (1 - risk));
}
