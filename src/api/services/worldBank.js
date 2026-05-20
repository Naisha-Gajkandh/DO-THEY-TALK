/**
 * World Bank API Service
 * Free, no API key required.
 * Docs: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392
 */
import { fetchWithCache } from '../fetcher';
import { normalizeTimeSeries } from '../normalizer';

const BASE_URL = 'https://api.worldbank.org/v2/country/WLD/indicator';

async function fetchIndicator(indicatorCode, startYear = 2000, endYear = 2022) {
  const url = `${BASE_URL}/${indicatorCode}`;
  const data = await fetchWithCache(url, {
    params: {
      format: 'json',
      date: `${startYear}:${endYear}`,
      per_page: 100,
    },
    cacheKey: `wb-${indicatorCode}-${startYear}-${endYear}`,
  });

  // World Bank returns [metadata, data_array]
  if (!data || !Array.isArray(data) || data.length < 2) return [];
  const records = data[1] || [];

  return normalizeTimeSeries(
    records.map(r => ({ year: r.date, value: r.value })),
    'year',
    'value'
  );
}

export const worldBankService = {
  getPopulation: () => fetchIndicator('SP.POP.TOTL'),
  getGDP: () => fetchIndicator('NY.GDP.MKTP.CD'),
  getGDPPerCapita: () => fetchIndicator('NY.GDP.PCAP.CD'),
  getInternetUsers: () => fetchIndicator('IT.NET.USER.ZS'),
  getLifeExpectancy: () => fetchIndicator('SP.DYN.LE00.IN'),
  getCO2Emissions: () => fetchIndicator('EN.ATM.CO2E.KT'),
  getElectricityAccess: () => fetchIndicator('EG.ELC.ACCS.ZS'),
  getForestArea: () => fetchIndicator('AG.LND.FRST.ZS'),
  getUrbanPopulation: () => fetchIndicator('SP.URB.TOTL.IN.ZS'),
  getMilitarySpending: () => fetchIndicator('MS.MIL.XPND.CD'),
  getTourismArrivals: () => fetchIndicator('ST.INT.ARVL'),
  getResearchSpending: () => fetchIndicator('GB.XPD.RSDV.GD.ZS'),
};
