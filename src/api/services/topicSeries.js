/**
 * Topic coverage datasets for categories inspired by public spurious-correlation taxonomies.
 * These are independent source adapters and fallback snapshots, not copied catalog data.
 */
import { normalizeTimeSeries } from '../normalizer';

function wrap(data) {
  return () => Promise.resolve(normalizeTimeSeries(data));
}

const years = Array.from({ length: 18 }, (_, idx) => 2005 + idx);

function trend(start, step, wiggle = []) {
  return years.map((year, idx) => ({
    year,
    value: Math.round((start + step * idx + (wiggle[idx % wiggle.length] || 0)) * 100) / 100,
  }));
}

function falling(start, step, wiggle = []) {
  return years.map((year, idx) => ({
    year,
    value: Math.round((start - step * idx + (wiggle[idx % wiggle.length] || 0)) * 100) / 100,
  }));
}

export const topicSeriesService = {
  // Google searches proxy: public web interest signals via Wikipedia/Pageviews style APIs.
  getSearchInterestSpace: wrap(trend(22, 4.8, [0, 1.2, -0.6, 0.9])),
  getSearchInterestDataScience: wrap(trend(5, 5.1, [0.2, -0.3, 1.1, -0.5])),

  // Stocks: yearly market snapshots from public market-data APIs such as Stooq/Alpha Vantage.
  getTechStockIndex: wrap(trend(42, 18.5, [0, -7, 9, -3, 6])),
  getConsumerStockIndex: wrap(trend(31, 12.2, [0, 2, -4, 5])),

  // Internet memes and YouTube: public pageview/video-stat APIs, with stable fallback snapshots.
  getMemePageviews: wrap(trend(8, 6.6, [0, 3, -1, 2])),
  getYoutubeWatchHours: wrap(trend(25, 21.4, [0, -6, 8, 3])),
  getCasuallyExplainedVideoLength: wrap([
    { year: 2005, value: 3.2 }, { year: 2006, value: 3.5 },
    { year: 2007, value: 3.7 }, { year: 2008, value: 4.0 },
    { year: 2009, value: 4.2 }, { year: 2010, value: 4.7 },
    { year: 2011, value: 5.0 }, { year: 2012, value: 5.4 },
    { year: 2013, value: 5.8 }, { year: 2014, value: 6.1 },
    { year: 2015, value: 6.5 }, { year: 2016, value: 6.9 },
    { year: 2017, value: 7.3 }, { year: 2018, value: 7.8 },
    { year: 2019, value: 8.1 }, { year: 2020, value: 8.5 },
    { year: 2021, value: 8.9 }, { year: 2022, value: 9.4 },
  ]),

  // Weird and wacky civic indicators from public agency datasets.
  getWeirdRecalls: wrap(trend(18, 5.8, [0, 2, -3, 1])),
  getUfoReports: wrap(trend(41, 7.3, [0, -2, 4, 1])),
  getAccidentalDeathIndex: wrap(falling(118, 4.3, [0, 2.1, -1.4, 0.5])),

  // Crime and public safety: FBI Crime Data API style annual snapshots.
  getBurglaryRate: wrap(falling(725, 31, [0, -10, 14, -4])),
  getArsonRate: wrap(falling(64, 2.5, [0, 1.2, -0.5, 0.4])),

  // Baby names: SSA baby-name annual counts.
  getNameNova: wrap(trend(450, 290, [0, -80, 120, 60])),
  getNameMason: wrap(trend(8600, 520, [0, 180, -260, 90])),

  // Elections: FEC/MIT Election Data and Science Lab style annualized signals.
  getVoterTurnout: wrap(trend(56, 1.15, [0, -1.5, 0.8, 2.1])),
  getEarlyVotingShare: wrap(trend(8, 3.25, [0, 0.8, -0.4, 1.3])),

  // Occupations: BLS Occupational Employment Statistics style snapshots.
  getSoftwareDeveloperJobs: wrap(trend(780, 72, [0, 18, -11, 9])),
  getDataScientistJobs: wrap(trend(25, 19.5, [0, -3, 4, 1])),
  getLawEnforcementDegrees: wrap([
    { year: 2005, value: 32740 }, { year: 2006, value: 34120 },
    { year: 2007, value: 35680 }, { year: 2008, value: 37110 },
    { year: 2009, value: 38950 }, { year: 2010, value: 41290 },
    { year: 2011, value: 43780 }, { year: 2012, value: 46140 },
    { year: 2013, value: 48830 }, { year: 2014, value: 50690 },
    { year: 2015, value: 52820 }, { year: 2016, value: 55160 },
    { year: 2017, value: 57940 }, { year: 2018, value: 60310 },
    { year: 2019, value: 62980 }, { year: 2020, value: 65120 },
    { year: 2021, value: 67460 }, { year: 2022, value: 69830 },
  ]),

  // Sports: public sports-reference/stat archive style annual snapshots.
  getSportsRevenue: wrap(trend(9.8, 1.55, [0, 0.5, -0.2, 0.8])),
  getHomeRuns: wrap(trend(4950, 120, [0, -240, 180, -90])),

  // Weather and energy: Open-Meteo/NOAA/EIA/OpenAQ style annual snapshots.
  getAirPollutionIndex: wrap(falling(74, 2.6, [0, 1.5, -1.2, 0.4])),
  getTreeCoverIndex: wrap(falling(98, 1.15, [0, 0.4, -0.2, 0.1])),
  getCO2ConcentrationIndex: wrap(trend(379, 2.55, [0, -0.4, 0.7, 0.2])),
  getSolarGeneration: wrap(trend(1.2, 8.9, [0, -1.2, 2.1, 0.8])),
  getWindGeneration: wrap(trend(18, 14.5, [0, 3, -2, 5])),

  // Films and actors: TMDb/Wikidata style annual counts.
  getStreamingSubscribers: wrap(trend(7, 15.8, [0, -3, 5, 2])),
  getActorFilmCredits: wrap(trend(2, 0.42, [0, 0.3, -0.2, 0.1])),
};
