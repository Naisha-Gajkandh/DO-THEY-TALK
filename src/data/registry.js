/**
 * Dataset Registry
 * Central catalog of all available datasets with metadata and fetch functions.
 */
import { worldBankService } from '../api/services/worldBank';
import { nasaService } from '../api/services/nasa';
import { exchangeService } from '../api/services/exchange';
import { miscService } from '../api/services/misc';
import TYLERVIGEN_DATA from './tylervigen';
import { isDatasetAllowed } from './contentFilter';

const RAW_DATASET_REGISTRY = [
  // Demographics & Social
  { id: 'wb-population', name: 'World Population', category: 'Social', unit: 'people', source: 'World Bank', isLive: true, fetchFn: worldBankService.getPopulation },
  { id: 'wb-urban', name: 'Urban Population (%)', category: 'Social', unit: '% of total', source: 'World Bank', isLive: true, fetchFn: worldBankService.getUrbanPopulation },
  { id: 'wb-tourism', name: 'International Tourism Arrivals', category: 'Social', unit: 'arrivals', source: 'World Bank', isLive: true, fetchFn: worldBankService.getTourismArrivals },
  { id: 'misc-divorce', name: 'US Divorce Rate', category: 'Social', unit: 'per 1000', source: 'CDC', isLive: false, fetchFn: miscService.getDivorceRate },
  { id: 'wb-life-expectancy', name: 'Life Expectancy (World)', category: 'Health', unit: 'years', source: 'World Bank', isLive: true, fetchFn: worldBankService.getLifeExpectancy },

  // Economy
  { id: 'wb-gdp', name: 'World GDP', category: 'Economy', unit: 'USD', source: 'World Bank', isLive: true, fetchFn: worldBankService.getGDP },
  { id: 'wb-military', name: 'Military Spending (World)', category: 'Economy', unit: 'USD', source: 'World Bank', isLive: true, fetchFn: worldBankService.getMilitarySpending },
  { id: 'fx-usd', name: 'EUR to USD Exchange Rate', category: 'Finance', unit: 'USD per EUR', source: 'Frankfurter', isLive: true, fetchFn: exchangeService.getUSDRate },
  { id: 'wb-research', name: 'Research & Development Spending', category: 'Economy', unit: '% of GDP', source: 'World Bank', isLive: true, fetchFn: worldBankService.getResearchSpending },

  // Environment & Weather
  { id: 'wb-co2', name: 'CO2 Emissions (World)', category: 'Environment', unit: 'kt', source: 'World Bank', isLive: true, fetchFn: worldBankService.getCO2Emissions },
  { id: 'wb-forest', name: 'Forest Area (%)', category: 'Environment', unit: '% of land', source: 'World Bank', isLive: true, fetchFn: worldBankService.getForestArea },
  { id: 'misc-temp-anomaly', name: 'Global Temperature Anomaly', category: 'Environment', unit: 'degrees C', source: 'NASA GISS', isLive: false, fetchFn: miscService.getTemperatureAnomaly },

  // Space
  { id: 'nasa-asteroids', name: 'Near-Earth Asteroid Discoveries', category: 'Space', unit: 'asteroids', source: 'NASA CNEOS', isLive: false, fetchFn: nasaService.getAsteroidDiscoveries },
  { id: 'nasa-budget', name: 'NASA Budget', category: 'Space', unit: '$ billions', source: 'NASA', isLive: false, fetchFn: nasaService.getNASABudget },
  { id: 'nasa-launches', name: 'Global Space Launches', category: 'Space', unit: 'launches', source: 'Space Launch Report', isLive: false, fetchFn: nasaService.getSpaceLaunches },

  // Consumption (The most "Spurious" section)
  { id: 'misc-cheese', name: 'US Cheese Consumption', category: 'Consumption', unit: 'lbs per capita', source: 'USDA', isLive: false, fetchFn: miscService.getCheeseConsumption },
  { id: 'misc-margarine', name: 'US Margarine Consumption', category: 'Consumption', unit: 'lbs per capita', source: 'USDA', isLive: false, fetchFn: miscService.getMargarineConsumption },
  { id: 'misc-honey', name: 'US Honey Production', category: 'Consumption', unit: 'million lbs', source: 'USDA', isLive: false, fetchFn: miscService.getHoneyProduction },
  { id: 'misc-avocado', name: 'Global Avocado Production', category: 'Consumption', unit: 'million tonnes', source: 'FAO', isLive: false, fetchFn: miscService.getAvocadoProduction },
  { id: 'misc-spelling-bee', name: 'Letters in Scripps Spelling Bee Winning Word', category: 'Entertainment', unit: 'letters', source: 'Scripps', isLive: false, fetchFn: miscService.getSpellingBeeLength },
  { id: 'misc-smartphones', name: 'Global Smartphone Users', category: 'Technology', unit: 'billions', source: 'Statista', isLive: false, fetchFn: miscService.getSmartphoneUsers },
  { id: 'wb-internet', name: 'Internet Users (%)', category: 'Technology', unit: '% of population', source: 'World Bank', isLive: true, fetchFn: worldBankService.getInternetUsers },

  // Weird Metrics
  { id: 'misc-pool-drownings', name: 'US Pool Drownings', category: 'Tragedy', unit: 'deaths', source: 'CDC', isLive: false, fetchFn: miscService.getPoolDrownings },
  { id: 'misc-cage-movies', name: 'Nicolas Cage Movies', category: 'Entertainment', unit: 'films', source: 'IMDb', isLive: false, fetchFn: miscService.getNicolasCageMovies },
  { id: 'misc-bedsheet-tangling', name: 'Deaths by Becoming Tangled in Bedsheets', category: 'Tragedy', unit: 'deaths', source: 'CDC', isLive: false, fetchFn: miscService.getBedsheetDeaths },
  { id: 'misc-arcades', name: 'Total Revenue Generated by Arcades', category: 'Economy', unit: 'USD', source: 'Census Bureau', isLive: false, fetchFn: miscService.getArcadeRevenue },
  { id: 'misc-cs-doctorates', name: 'Computer Science Doctorates Awarded (US)', category: 'Education', unit: 'degrees', source: 'National Science Foundation', isLive: false, fetchFn: miscService.getCSDoctorates },
  
  // Tyler Vigen Scraped Data
  ...TYLERVIGEN_DATA
];

const DATASET_REGISTRY = RAW_DATASET_REGISTRY.filter(isDatasetAllowed);

export default DATASET_REGISTRY;

/**
 * Enhanced matching engine logic
 */
export function getDatasetById(id) {
  return DATASET_REGISTRY.find(d => d.id === id);
}

export function getRandomPair() {
  const ids = DATASET_REGISTRY.map(d => d.id);
  const i = Math.floor(Math.random() * ids.length);
  let j = Math.floor(Math.random() * (ids.length - 1));
  if (j >= i) j++;
  return [ids[i], ids[j]];
}
