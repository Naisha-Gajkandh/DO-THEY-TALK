/**
 * Topic definitions for the local correlation discovery model.
 */

const CATEGORIES = [
  { id: 'spurious-classics', name: 'Spurious Classics', dataCategories: ['Consumption', 'Tragedy', 'Economy', 'Education', 'Food'], icon: 'activity', color: 'rose', themeColor: '#e11d48', ambience: 'bubbles', description: 'The most infamous coincidences from the original Spurious Correlations archive.', tagline: 'Margarine, Cheese, and Chaos' },
  { id: 'google-searches', name: 'Google Searches', dataCategories: ['google-searches'], icon: 'search', color: 'blue', themeColor: '#3b82f6', ambience: 'matrix', description: 'What the internet is searching for.', tagline: 'Trending queries' },
  { id: 'planets', name: 'Planets', dataCategories: ['Space', 'planets'], icon: 'rocket', color: 'violet', themeColor: '#7c3aed', ambience: 'planets', description: 'Space and orbital-adjacent numbers with very earthly coincidences', tagline: 'Out of orbit, statistically' },
  { id: 'stocks', name: 'Stocks', dataCategories: ['Economy', 'Finance', 'stocks'], icon: 'trending', color: 'emerald', themeColor: '#059669', ambience: 'charts', description: 'Stock market prices and economic indicators.', tagline: 'Portfolio-grade nonsense' },
  { id: 'memes', name: 'Memes', dataCategories: ['memes', 'Entertainment'], icon: 'smile', color: 'yellow', themeColor: '#eab308', ambience: 'bubbles', description: 'The rise and fall of internet culture.', tagline: 'Viral coincidences' },
  { id: 'weird', name: 'Weird & Wacky', dataCategories: ['weird', 'Weird Metrics'], icon: 'help', color: 'fuchsia', themeColor: '#d946ef', ambience: 'smoke', description: 'Completely bizarre and inexplicable metrics.', tagline: 'Unexplainable data' },
  { id: 'crime', name: 'Crime', dataCategories: ['crime', 'Tragedy'], icon: 'shield', color: 'slate', themeColor: '#475569', ambience: 'smoke', description: 'Crime rates and statistics.', tagline: 'Statistically suspicious' },
  { id: 'death', name: 'Death & Danger', dataCategories: ['Tragedy', 'Health', 'death'], icon: 'skull', color: 'slate', themeColor: '#374151', ambience: 'smoke', description: 'Mortality and risk signals wrapped in black-and-grey atmosphere', tagline: 'Dark charts, darker coincidences' },
  { id: 'baby-names', name: 'Baby Names', dataCategories: ['babynames', 'Social'], icon: 'users', color: 'pink', themeColor: '#ec4899', ambience: 'bubbles', description: 'Trends in what people name their children.', tagline: 'What is in a name?' },
  { id: 'elections', name: 'Elections', dataCategories: ['elections', 'Politics'], icon: 'flag', color: 'red', themeColor: '#ef4444', ambience: 'charts', description: 'Voting trends and political data.', tagline: 'Statistically elected' },
  { id: 'youtube', name: 'YouTube', dataCategories: ['youtube', 'Technology', 'Entertainment'], icon: 'video', color: 'red', themeColor: '#dc2626', ambience: 'matrix', description: 'Trends in video titles and creators.', tagline: 'Smash that subscribe button' },
  { id: 'occupations', name: 'Occupations', dataCategories: ['occupations', 'Economy'], icon: 'briefcase', color: 'stone', themeColor: '#57534e', ambience: 'charts', description: 'Jobs, salaries, and employment data.', tagline: 'Working 9 to 5' },
  { id: 'sports', name: 'Sports', dataCategories: ['sports', 'Entertainment'], icon: 'award', color: 'orange', themeColor: '#f97316', ambience: 'bubbles', description: 'Athletic performance and ticket sales.', tagline: 'Statistically athletic' },
  { id: 'weather', name: 'Weather', dataCategories: ['weather', 'Environment'], icon: 'cloud', color: 'sky', themeColor: '#0ea5e9', ambience: 'leaves', description: 'Temperature and meteorological data.', tagline: 'Statistically cloudy' },
  { id: 'environment', name: 'Environment', dataCategories: ['Environment', 'environment'], icon: 'leaf', color: 'green', themeColor: '#16a34a', ambience: 'leaves', description: 'Green public-source indicators scored against unrelated datasets', tagline: 'Springtime for skeptical charts' },
  { id: 'energy', name: 'Energy', dataCategories: ['energy', 'Environment'], icon: 'zap', color: 'yellow', themeColor: '#eab308', ambience: 'matrix', description: 'Power generation and fuel consumption.', tagline: 'High-voltage correlations' },
  { id: 'films', name: 'Films', dataCategories: ['films', 'Entertainment'], icon: 'film', color: 'purple', themeColor: '#a855f7', ambience: 'bubbles', description: 'Box office hits and actor appearances.', tagline: 'Statistically cinematic' },
  { id: 'food', name: 'Food', dataCategories: ['food', 'Consumption'], icon: 'utensils', color: 'amber', themeColor: '#d97706', ambience: 'bubbles', description: 'Agricultural production and dietary habits.', tagline: 'Market-basket madness' },
  { id: 'education', name: 'Education', dataCategories: ['education', 'Social'], icon: 'book', color: 'indigo', themeColor: '#4f46e5', ambience: 'charts', description: 'Degrees awarded and academic data.', tagline: 'Statistically educated' },
];

export default CATEGORIES;

export function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id);
}

export function getRandomCategory() {
  return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
}
