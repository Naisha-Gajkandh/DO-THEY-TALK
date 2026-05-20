/**
 * Correlation engine.
 * Cleans, aligns, scores, and gates annual series before charts can render.
 */
import { MIN_DISPLAY_CORRELATION, scoreCorrelation } from './correlationModel';

/**
 * Calculate full correlation stats between two normalized datasets.
 * @param {Array<{year:number, value:number}>} dataA
 * @param {Array<{year:number, value:number}>} dataB
 * @returns {object} Correlation results
 */
export function calculateCorrelation(dataA, dataB) {
  const model = scoreCorrelation(dataA, dataB);
  const { years, valuesA, valuesB, r, rSquared, absR } = model;

  if (years.length < 6) {
    return {
      r: 0,
      rSquared: 0,
      rPercent: '0.0',
      r2Percent: '0.0',
      years,
      valuesA,
      valuesB,
      dataPoints: years.length,
      direction: 'none',
      label: 'Insufficient Data',
      color: 'gray',
      valid: false,
      passesThreshold: false,
      threshold: MIN_DISPLAY_CORRELATION,
      modelReason: model.reason,
      confidence: 0,
    };
  }

  return {
    r,
    rSquared,
    rPercent: (absR * 100).toFixed(1),
    r2Percent: (rSquared * 100).toFixed(1),
    years,
    valuesA,
    valuesB,
    dataPoints: years.length,
    direction: r >= 0 ? 'positive' : 'negative',
    label: getCorrelationLabel(absR),
    color: getCorrelationColor(absR),
    valid: model.passesThreshold,
    passesThreshold: model.passesThreshold,
    threshold: MIN_DISPLAY_CORRELATION,
    modelReason: model.reason,
    confidence: model.confidence,
  };
}

function getCorrelationLabel(absR) {
  if (absR >= 0.95) return 'Suspiciously Similar';
  if (absR >= MIN_DISPLAY_CORRELATION) return 'Dangerously Correlated';
  return 'Below Display Threshold';
}

function getCorrelationColor(absR) {
  if (absR >= 0.95) return 'text-rose-400';
  if (absR >= MIN_DISPLAY_CORRELATION) return 'text-amber-400';
  return 'text-gray-400';
}
