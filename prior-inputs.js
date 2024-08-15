import { truncateInput } from "./input-helpers.js";

addParityEventListeners();

// truncation limits for input values
const truncLimits = {
  age: {
    lower: 12,
    upper: 55,
  },
  weight: {
    lower: 34,
    upper: 190,
  },
  height: {
    lower: 127,
    upper: 198,
  },
  pregnancyInterval: {
    lower: 0.25,
    upper: 15,
  },
  prevGestationAge: {
    lower: 24,
    upper: 42,
  }
};

// TODO get the form data only when Calculate risk is clicked

// get history form input values and truncate
const formData = new FormData(document.getElementById("predictionForm"));
const parous = formData.get("age") === "parous";


export const priorForm = {
  age: Math.max(
    truncLimits.age.lower,
    Math.min(parseFloat(formData.get("age")), truncLimits.age.upper)
  ),
  weight: Math.max(
    truncLimits.weight.lower,
    Math.min(parseFloat(formData.get("weight")), truncLimits.weight.upper)
  ),
  height: Math.max(
    truncLimits.height.lower,
    Math.min(parseFloat(formData.get("height")), truncLimits.height.upper)
  ),
  ethnicity: formData.get("ethnicity") === "white" ? 0 : 1,
  familyHistoryPE: formData.get("fam-hist-pe") === "yes" ? 1 : 0,
  conception: formData.get("conception") === "spontaneous" ? 0 : 1,
  chronicHypert: formData.get("chronic-hypert") === "yes" ? 1 : 0,
  diabetes: formData.get("diabetes") === "yes" ? 1 : 0,
  autoimmune: formData.get("autoimmune") === "yes" ? 1 : 0,
  pregnancyInterval: parous
    ? Math.max(
        truncLimits.pregnancyInterval.lower,
        Math.min(
          parseFloat(formData.get("preg-interval")),
          truncLimits.pregnancyInterval.upper
        )
      )
    : 0,
  prevGestAge: parous
    ? truncateInput(
        truncLimits.prevGestationAge.lower,
        formData.get("prev-gest-age"),
        truncLimits.prevGestationAge.upper
      )
    : 0,
};

export const priorCoeffs = {
  constant: 54.3637,
  age: priorForm.age > 35 ? -0.206886 * priorForm.age : 0,
  height: 0.11711 * (priorForm.height - 164),

  ethnicityBlack: formData.get("ethnicity") === "black" ? -2.6786 : 0,
  ethnicitySouthAsian: formData.get("ethnicity") === "south_asian" ? -1.129 : 0,

  chronicHypert: priorForm.chronicHypert * -7.2897,
  autoimmune: priorForm.autoimmune * -3.0519,
  conceptionIVF: formData.get("conception") === "ivf" ? -1.6327 : 0,

  parousWithPE: formData.get("parity") === "parous_with_pe" ? -8.1667 : 0,
  parousWithPEGestAge:
  formData.get("parity") === "parous_with_pe"
      ? 0.0271988 * Math.pow(priorForm.prevGestationAge - 24, 2)
      : 0,
  parousNoPE: formData.get("parity") === "parous_no_pe" ? -4.335 : 0,
  parousNoPEInterval:
  formData.get("parity") === "parous_no_pe"
      ? -4.1513765 * (priorForm.pregnancyInterval - 1)
      : 0,
  parousNoPEIntervalSquared:
  formData.get("parity") === "parous_no_pe"
      ? 9.21473572 * (priorForm.pregnancyInterval - 0.5)
      : 0,
  parousNoPEGestationalAge:
  formData.get("parity") === "parous_no_pe"
      ? 0.01549673 * Math.pow(priorForm.prevGestationAge - 24, 2)
      : 0,

  weight:
    priorForm.chronicHypert === 0
      ? -0.0694096 * (priorForm.weight - 69)
      : 0,
  familyHistoryPE:
    priorForm.chronicHypert === 0
      ? -1.7154 * priorForm.familyHistoryPE
      : 0,
  diabetes:
    priorForm.chronicHypert === 0 ? -3.3899 * priorForm.diabetes : 0,
};

function addParityEventListeners() {
  document.addEventListener("DOMContentLoaded", function () {
    var paritySelect = document.getElementById("parity");
    var parousInputs = document.getElementById("parousInputs");

    function toggleParousInputs() {
      if (paritySelect.value === "nulliparous") {
        parousInputs.classList.add("hidden");
      } else {
        parousInputs.classList.remove("hidden");
      }
    }

    paritySelect.addEventListener("change", toggleParousInputs);

    // Initial call to set the correct state on page load
    toggleParousInputs();
  });
}
