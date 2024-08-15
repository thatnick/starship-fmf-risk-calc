export function truncateInput(inputValue, lowerLimit, upperLimit) {
  return Math.max(lowerLimit, Math.min(parseFloat(inputValue), upperLimit));
}

export function isInputEmpty(formData, inputName) {
  const value = formData.get(inputName);
  return value === null || value.trim() === "";
}
