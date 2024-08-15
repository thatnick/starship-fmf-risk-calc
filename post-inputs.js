import { isInputEmpty } from "./input-helpers.js";

// covariance matrix (pxp) for the distribution of x
export const sigma = [
  [0.00141396, -0.0002726, -0.0001907],
  [-0.0002726, 0.01630906, -0.0034539],
  [-0.0001907, -0.0034539, 0.03147225],
];

export const markers = {
    map: { b0: 0.088997, b1: -0.0016711 },
    utaPi: { b0: 0.5861, b1: -0.014233 },
    plgf: { b0: -0.92352, b1: 0.021584 },
  };

const truncLimits = {
  map: {
    lower: -0.1224076,
    upper: 0.12240759,
  },
  utaPi: {
    lower: -0.4216152,
    upper: 0.42161519,
  },
  plgf: {
    lower: -0.5655099,
    upper: 0.56550992,
  },
};

const formData = new FormData(document.getElementById("predictionForm"));

export const postForm = {
  empty: isInputEmpty(formData, "map") && isInputEmpty(formData, "uta_pi") && isInputEmpty(formData, "plgf"),
  mapMoM: Math.max(
    truncLimits.map.lower,
    Math.min(parseFloat(formData.get("map")), truncLimits.map.upper)
  ),
  utaPiMoM: Math.max(
    truncLimits.utaPi.lower,
    Math.min(parseFloat(formData.get("uta-pi")), truncLimits.utaPi.upper)
  ),
  plgfMoM: Math.max(
    truncLimits.plgf.lower,
    Math.min(parseFloat(formData.get("plgf")), truncLimits.plgf.upper)
  ),
};
