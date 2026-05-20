const BLOCKED_DATASET_IDS = new Set([
  'tv_google_searches_for_why_do_i_have_green_poop',
]);

export const BLOCKED_DATASETS = [
  {
    id: 'tv_google_searches_for_why_do_i_have_green_poop',
    name: "Google searches for 'why do i have green poop'",
    reason: 'gross/body-function query',
  },
];

export function isDatasetAllowed(dataset) {
  return dataset && !BLOCKED_DATASET_IDS.has(dataset.id);
}

export function isCorrelationAllowed(correlation) {
  if (!correlation) return false;
  if (BLOCKED_DATASET_IDS.has(correlation.a) || BLOCKED_DATASET_IDS.has(correlation.b)) {
    return false;
  }

  return !/green poop/i.test(correlation.title || '');
}
