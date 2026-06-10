/**
 * Narrative facade.
 * Python owns the model-generated explanation path, while this file keeps a
 * deterministic browser fallback for offline runtime resilience.
 */
import pythonEngine from './pythonEngine';

const TEMPLATES = [
  "Experts at the {institute} suspect that {varA_action} may directly {effect} {varB_action}.",
  "A groundbreaking study from {institute} revealed a {adjective} link between {varA} and {varB}, though nobody can explain why.",
  "Leading researchers believe that as {varA_action}, the resulting {phenomenon} inevitably causes {varB_action}.",
  "According to a {adjective} paper published in {journal}, {varA} sends microscopic {particles} into the atmosphere, which {effect} {varB}.",
  "It is widely theorized that {varA_action} creates a quantum {phenomenon} that resonates at the exact frequency needed to {effect} {varB}.",
  "Scientists at {institute} have long suspected that {varA} and {varB} are connected through a shared dependency on {substance}.",
  "A leaked report from {institute} suggests that the statistical link between {varA} and {varB} may be caused by interdimensional {particles}.",
  "Researchers were shocked to discover that {varA_action} releases trace amounts of {substance}, which is known to {effect} {varB}.",
  "The {adjective} relationship between {varA} and {varB} has baffled scientists, though one theory involves {substance} and {phenomenon}.",
  "A controversial hypothesis proposes that {varA} and {varB} are both controlled by the same colony of sentient {particles} living beneath {location}.",
];

const INSTITUTES = [
  "Harvard Institute for Implausible Research",
  "MIT Department of Meaningless Statistics",
  "Oxford Centre for Absurd Correlations",
  "Stanford Lab for Questionable Science",
  "Yale Bureau of Numbers That Don't Matter",
  "Princeton Department of Data Hallucinations",
  "Caltech Center for Statistical Mirages",
  "Cambridge Institute of Doubtful Inferences",
];

const JOURNALS = [
  "The Journal of Unlikely Connections",
  "Nature: Probably Not",
  "The Annals of Dubious Statistics",
  "Science: But Actually No",
  "The Quarterly Review of Nonsense",
  "Proceedings of the Royal Society of Made-Up Facts",
];

const ADJECTIVES = [
  "startling", "baffling", "unprecedented", "deeply concerning",
  "statistically suspicious", "mind-boggling", "weirdly specific",
  "mathematically inevitable", "cosmically significant", "profoundly useless",
];

const PHENOMENA = [
  "resonance cascade", "butterfly effect", "quantum entanglement",
  "gravitational distortion", "electromagnetic vortex",
  "temporal anomaly", "statistical wormhole", "harmonic convergence",
  "thermodynamic paradox", "cosmic synchronicity",
];

const PARTICLES = [
  "neutrinos", "cheese particles", "correlation photons",
  "statistical muons", "data quarks", "probability waves",
  "causation bosons", "regression leptons", "p-value ions",
];

const SUBSTANCES = [
  "dark matter", "oat milk residue", "trace amounts of irony",
  "compressed moonlight", "crystallized sarcasm",
  "synthetic correlation serum", "concentrated uncertainty",
  "distilled coincidence", "fermented data points",
];

const EFFECTS = [
  "directly influence", "catastrophically disrupt",
  "subtly modulate", "inexplicably amplify",
  "reverse the polarity of", "permanently alter",
  "temporarily suppress", "dramatically accelerate",
];

const LOCATIONS = [
  "the Pacific Ocean", "Switzerland", "a Costco parking lot",
  "the Bermuda Triangle", "a server room in Oregon",
  "the Moon's dark side", "suburban Ohio",
];

const ACTIONS_PREFIX = [
  "increasing", "decreasing", "fluctuating",
  "the steady rise of", "the mysterious decline in",
  "unprecedented changes in", "seasonal variations in",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate a fake scientific explanation for a correlation.
 * @param {string} nameA - Name of variable A
 * @param {string} nameB - Name of variable B
 * @returns {string} A hilariously fake explanation
 */
export function generateExplanation(nameA, nameB) {
  const template = pick(TEMPLATES);
  const varA_action = `${pick(ACTIONS_PREFIX)} ${nameA.toLowerCase()}`;
  const varB_action = `${pick(ACTIONS_PREFIX)} ${nameB.toLowerCase()}`;

  return template
    .replace('{varA}', nameA)
    .replace('{varB}', nameB)
    .replace('{varA_action}', varA_action)
    .replace('{varB_action}', varB_action)
    .replace('{institute}', pick(INSTITUTES))
    .replace('{journal}', pick(JOURNALS))
    .replace('{adjective}', pick(ADJECTIVES))
    .replace('{phenomenon}', pick(PHENOMENA))
    .replace('{particles}', pick(PARTICLES))
    .replace('{substance}', pick(SUBSTANCES))
    .replace('{effect}', pick(EFFECTS))
    .replace('{location}', pick(LOCATIONS));
}

/**
 * Generate a dramatic headline.
 */
export function generateHeadline(nameA, nameB, rPercent) {
  const headlines = [
    `"${nameA}" and "${nameB}" are ${rPercent}% correlated - scientists are baffled`,
    `BREAKING: ${nameA} linked to ${nameB} with ${rPercent}% confidence`,
    `Study reveals shocking ${rPercent}% connection between ${nameA} and ${nameB}`,
    `New data shows ${nameA} may be secretly influencing ${nameB}`,
    `${rPercent}% match: Is ${nameA} really driving ${nameB}?`,
  ];
  return pick(headlines);
}

function withTimeout(promise, timeoutMs = 3000) {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error('Python narrative timed out'));
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

export async function generateExplanationPayload(nameA, nameB, rPercent) {
  try {
    return await withTimeout(pythonEngine.generateExplanation(nameA, nameB, rPercent));
  } catch {
    return {
      headline: generateHeadline(nameA, nameB, rPercent),
      explanation: generateExplanation(nameA, nameB),
      observations: [
        `The cleaned annual series crosses the display threshold at ${rPercent}% correlation.`,
        'This is a strong pattern match, not evidence that one variable caused the other.',
        'Confidence reflects overlap and statistical strength after normalization and interpolation.',
      ],
    };
  }
}
