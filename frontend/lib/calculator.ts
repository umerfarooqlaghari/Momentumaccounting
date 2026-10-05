import type { TaxRates } from "./types";

// Salary vs dividend illustration for a sole-director limited company (England, Wales & NI rates).
// Simplifications (stated on the page): no employment allowance, no associated companies, full-year
// accounting period, all post-tax profit paid out as dividends, no pension contributions.

const pct = (n: number) => n / 100;

export function corporationTax(profit: number, r: TaxRates) {
  if (profit <= 0) return 0;
  if (profit <= r.ctLowerLimit) return profit * pct(r.ctSmallProfitsRate);
  if (profit >= r.ctUpperLimit) return profit * pct(r.ctMainRate);
  // Marginal relief: fraction chosen so the charge meets the small-profits rate at the lower limit.
  const fraction = (r.ctLowerLimit * (pct(r.ctMainRate) - pct(r.ctSmallProfitsRate))) / (r.ctUpperLimit - r.ctLowerLimit);
  return profit * pct(r.ctMainRate) - fraction * (r.ctUpperLimit - profit);
}

export function employerNi(salary: number, r: TaxRates) {
  return Math.max(0, salary - r.employerNiThreshold) * pct(r.employerNiRate);
}

export function employeeNi(salary: number, r: TaxRates) {
  const main = Math.max(0, Math.min(salary, r.employeeNiUpperLimit) - r.employeeNiThreshold) * pct(r.employeeNiRate);
  const upper = Math.max(0, salary - r.employeeNiUpperLimit) * pct(r.employeeNiUpperRate);
  return main + upper;
}

function personalAllowance(totalIncome: number, r: TaxRates) {
  const taper = Math.max(0, totalIncome - 100_000) / 2;
  return Math.max(0, r.personalAllowance - taper);
}

/** Taxes `amount` occupying band space from `start` (taxable-income terms) at the given band rates. */
function sliceTax(start: number, amount: number, bands: { upTo: number; rate: number }[]) {
  let tax = 0;
  let pos = start;
  let left = amount;
  let lower = 0;
  for (const b of bands) {
    if (left <= 0) break;
    if (pos < b.upTo) {
      const room = b.upTo - Math.max(pos, lower);
      const used = Math.min(room, left);
      tax += used * b.rate;
      pos += used;
      left -= used;
    }
    lower = b.upTo;
  }
  return tax;
}

export function incomeTax(nonSavings: number, dividends: number, r: TaxRates) {
  const pa = personalAllowance(nonSavings + dividends, r);
  const nsTaxable = Math.max(0, nonSavings - pa);
  const paLeft = Math.max(0, pa - nonSavings);
  const divTaxable = Math.max(0, dividends - paLeft);

  const basic = r.basicRateBand;
  const higher = r.additionalRateThreshold;
  const nsTax = sliceTax(0, nsTaxable, [
    { upTo: basic, rate: pct(r.basicRate) },
    { upTo: higher, rate: pct(r.higherRate) },
    { upTo: Infinity, rate: pct(r.additionalRate) },
  ]);
  // The dividend allowance is taxed at 0% but still uses up band space.
  const allowance = Math.min(r.dividendAllowance, divTaxable);
  const divTax = sliceTax(nsTaxable + allowance, divTaxable - allowance, [
    { upTo: basic, rate: pct(r.dividendBasicRate) },
    { upTo: higher, rate: pct(r.dividendHigherRate) },
    { upTo: Infinity, rate: pct(r.dividendAdditionalRate) },
  ]);
  return nsTax + divTax;
}

export type Scenario = {
  salary: number;
  dividends: number;
  corporationTax: number;
  employerNi: number;
  employeeNi: number;
  incomeTax: number;
  totalTax: number;
  takeHome: number;
};

export function scenario(profit: number, salary: number, otherIncome: number, r: TaxRates): Scenario | null {
  const erNi = employerNi(salary, r);
  if (salary + erNi > profit) return null;
  const taxableProfit = profit - salary - erNi;
  const ct = corporationTax(taxableProfit, r);
  const dividends = Math.max(0, taxableProfit - ct);
  const eeNi = employeeNi(salary, r);
  const it = incomeTax(salary + otherIncome, dividends, r) - incomeTax(otherIncome, 0, r);
  const takeHome = salary + dividends - eeNi - it;
  return { salary, dividends, corporationTax: ct, employerNi: erNi, employeeNi: eeNi, incomeTax: it, totalTax: ct + erNi + eeNi + it, takeHome };
}

/** Salary that uses all profit as salary (employer NI included). */
export function allSalary(profit: number, r: TaxRates) {
  const rate = pct(r.employerNiRate);
  const s = profit <= r.employerNiThreshold ? profit : (profit + r.employerNiThreshold * rate) / (1 + rate);
  return Math.floor(s);
}

export function optimise(profit: number, otherIncome: number, r: TaxRates) {
  const candidates = new Set<number>([0, r.employerNiThreshold, r.employeeNiThreshold, r.personalAllowance, allSalary(profit, r)]);
  for (let s = 0; s <= Math.min(profit, 200_000); s += 100) candidates.add(s);
  let best: Scenario | null = null;
  for (const s of candidates) {
    const sc = scenario(profit, s, otherIncome, r);
    if (sc && (!best || sc.takeHome > best.takeHome + 0.005)) best = sc;
  }
  return {
    best,
    allSalary: scenario(profit, allSalary(profit, r), otherIncome, r),
    allDividends: scenario(profit, 0, otherIncome, r),
  };
}
