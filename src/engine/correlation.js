/**
 * Correlation engine facade.
 * Python handles the statistical scoring path. The JavaScript model remains
 * as a local resilience fallback when the Pyodide worker is still booting.
 */
import pythonEngine from './pythonEngine';
import { MIN_DISPLAY_CORRELATION, scoreCorrelation as fallbackScoreCorrelation } from './correlationModel';

const PYTHON_TIMEOUT_MS = 3500;

function withTimeout(promise, timeoutMs = PYTHON_TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error('Python engine timed out'));
    }, timeoutMs);

    promise
      .then(value => {
        window.clearTimeout(timer);
        resolve(value);
      })
      .catch(error => {
        window.clearTimeout(timer);
        reject(error);
      });
  });
}

async function scoreWithPython(dataA, dataB) {
  try {
    return await withTimeout(
      pythonEngine.calculateCorrelation(dataA, dataB, MIN_DISPLAY_CORRELATION)
    );
  } catch (error) {
    return fallbackScoreCorrelation(dataA, dataB, MIN_DISPLAY_CORRELATION);
  }
}

function getCorrelationLabel(absR) {
  if (absR >= 0.97) return 'Cinematic Lockstep';
  if (absR >= 0.95) return 'Suspiciously Similar';
  if (absR >= MIN_DISPLAY_CORRELATION) return 'Dangerously Correlated';
  return 'Below Display Threshold';
}

function getCorrelationColor(absR) {
  if (absR >= 0.97) return 'text-rose-400';
  if (absR >= 0.95) return 'text-orange-300';
  if (absR >= MIN_DISPLAY_CORRELATION) return 'text-amber-300';
  return 'text-gray-400';
}

function toDisplayResult(model) {
  const years = model.years || [];
  const valuesA = model.valuesA || [];
  const valuesB = model.valuesB || [];
  const r = Number(model.r || 0);
  const rSquared = Number(model.rSquared || r * r);
  const absR = Number(model.absR || Math.abs(r));

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
    valid: Boolean(model.passesThreshold),
    passesThreshold: Boolean(model.passesThreshold),
    threshold: MIN_DISPLAY_CORRELATION,
    modelReason: model.reason,
    confidence: Number(model.confidence || 0),
  };
}

export async function calculateCorrelation(dataA, dataB) {
  const model = await scoreWithPython(dataA, dataB);
  return toDisplayResult(model);
}
