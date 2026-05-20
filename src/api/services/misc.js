/**
 * Miscellaneous curated datasets
 */
import { normalizeTimeSeries } from '../normalizer';

function wrap(data) {
  return () => Promise.resolve(normalizeTimeSeries(data));
}

export const miscService = {
  /** US cheese consumption - Highly correlated with bedsheet deaths */
  getCheeseConsumption: wrap([
    { year: 2000, value: 29.8 }, { year: 2001, value: 30.1 }, { year: 2002, value: 30.5 },
    { year: 2003, value: 30.6 }, { year: 2004, value: 31.3 }, { year: 2005, value: 31.7 },
    { year: 2006, value: 32.6 }, { year: 2007, value: 33.1 }, { year: 2008, value: 32.7 },
    { year: 2009, value: 32.8 }
  ]),

  /** US deaths by bedsheet tangling - Tuned to Cheese */
  getBedsheetDeaths: wrap([
    { year: 2000, value: 327 }, { year: 2001, value: 456 }, { year: 2002, value: 509 },
    { year: 2003, value: 497 }, { year: 2004, value: 596 }, { year: 2005, value: 573 },
    { year: 2006, value: 661 }, { year: 2007, value: 741 }, { year: 2008, value: 809 },
    { year: 2009, value: 717 }
  ]),

  /** US Margarine consumption - Highly correlated with Divorce Rate */
  getMargarineConsumption: wrap([
    { year: 2000, value: 8.2 }, { year: 2001, value: 7.0 }, { year: 2002, value: 6.5 },
    { year: 2003, value: 5.3 }, { year: 2004, value: 5.2 }, { year: 2005, value: 4.0 },
    { year: 2006, value: 4.6 }, { year: 2007, value: 4.5 }, { year: 2008, value: 4.2 },
    { year: 2009, value: 3.7 }
  ]),

  /** US divorce rate (Maine) - Tuned to Margarine */
  getDivorceRate: wrap([
    { year: 2000, value: 5.0 }, { year: 2001, value: 4.7 }, { year: 2002, value: 4.6 },
    { year: 2003, value: 4.4 }, { year: 2004, value: 4.3 }, { year: 2005, value: 4.1 },
    { year: 2006, value: 4.2 }, { year: 2007, value: 4.2 }, { year: 2008, value: 4.0 },
    { year: 2009, value: 3.8 }
  ]),

  /** Arcade Revenue - Highly correlated with CS Doctorates */
  getArcadeRevenue: wrap([
    { year: 2000, value: 1.196 }, { year: 2001, value: 1.176 }, { year: 2002, value: 1.269 },
    { year: 2003, value: 1.240 }, { year: 2004, value: 1.307 }, { year: 2005, value: 1.435 },
    { year: 2006, value: 1.601 }, { year: 2007, value: 1.654 }, { year: 2008, value: 1.803 },
    { year: 2009, value: 1.734 }
  ]),

  /** CS Doctorates (US) - Tuned to Arcades */
  getCSDoctorates: wrap([
    { year: 2000, value: 861 }, { year: 2001, value: 830 }, { year: 2002, value: 809 },
    { year: 2003, value: 867 }, { year: 2004, value: 948 }, { year: 2005, value: 1129 },
    { year: 2006, value: 1453 }, { year: 2007, value: 1656 }, { year: 2008, value: 1787 },
    { year: 2009, value: 1611 }
  ]),

  /** Spelling Bee Length - Highly correlated with Pool Drownings */
  getSpellingBeeLength: wrap([
    { year: 1999, value: 9 }, { year: 2000, value: 8 }, { year: 2001, value: 11 },
    { year: 2002, value: 12 }, { year: 2003, value: 11 }, { year: 2004, value: 8 },
    { year: 2005, value: 12 }, { year: 2006, value: 9 }, { year: 2007, value: 9 },
    { year: 2008, value: 10 }
  ]),

  /** Pool Drownings - Tuned to Spelling Bee */
  getPoolDrownings: wrap([
    { year: 1999, value: 109 }, { year: 2000, value: 102 }, { year: 2001, value: 102 },
    { year: 2002, value: 98 }, { year: 2003, value: 85 }, { year: 2004, value: 95 },
    { year: 2005, value: 89 }, { year: 2006, value: 98 }, { year: 2007, value: 102 },
    { year: 2008, value: 94 }
  ]),

  getHoneyProduction: wrap([
    { year: 2005, value: 174 }, { year: 2006, value: 155 }, { year: 2007, value: 148 }, { year: 2008, value: 161 }
  ]),
  getTemperatureAnomaly: wrap([
    { year: 2005, value: 0.68 }, { year: 2006, value: 0.64 }, { year: 2007, value: 0.66 }, { year: 2008, value: 0.54 }
  ]),
  getSmartphoneUsers: wrap([
    { year: 2005, value: 0.17 }, { year: 2006, value: 0.23 }, { year: 2007, value: 0.33 }, { year: 2008, value: 0.43 }
  ]),
  getAvocadoProduction: wrap([
    { year: 2005, value: 3.21 }, { year: 2006, value: 3.33 }, { year: 2007, value: 3.56 }, { year: 2008, value: 3.45 }
  ]),
};
