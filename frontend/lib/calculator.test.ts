import { test } from "node:test";
import assert from "node:assert/strict";
import { corporationTax, employeeNi, employerNi, incomeTax, optimise } from "./calculator.ts";
import type { TaxRates } from "./types.ts";

const r: TaxRates = {
  taxYear: "2026/27",
  personalAllowance: 12570,
  basicRateBand: 37700,
  additionalRateThreshold: 125140,
  basicRate: 20,
  higherRate: 40,
  additionalRate: 45,
  dividendAllowance: 500,
  dividendBasicRate: 10.75,
  dividendHigherRate: 35.75,
  dividendAdditionalRate: 39.35,
  employeeNiThreshold: 12570,
  employeeNiUpperLimit: 50270,
  employeeNiRate: 8,
  employeeNiUpperRate: 2,
  employerNiThreshold: 5000,
  employerNiRate: 15,
  ctSmallProfitsRate: 19,
  ctMainRate: 25,
  ctLowerLimit: 50000,
  ctUpperLimit: 250000,
};

const close = (a: number, b: number) => assert.ok(Math.abs(a - b) < 0.01, `${a} ≠ ${b}`);

test("corporation tax: small profits, main rate and marginal relief", () => {
  close(corporationTax(40_000, r), 7_600);
  close(corporationTax(300_000, r), 75_000);
  close(corporationTax(100_000, r), 22_750); // 25,000 − 3/200 × 150,000
  close(corporationTax(50_000, r), 9_500);
});

test("national insurance", () => {
  close(employerNi(12_570, r), 1_135.5);
  close(employeeNi(12_570, r), 0);
  close(employeeNi(60_000, r), 3_016 + 194.6);
});

test("income tax: salary at personal allowance plus dividends", () => {
  close(incomeTax(12_570, 0, r), 0);
  // £50k dividends: £500 allowance, £37,200 at 10.75%, £12,300 at 35.75%
  close(incomeTax(12_570, 50_000, r), 3_999 + 4_397.25);
});

test("income tax: personal allowance tapers above £100k", () => {
  close(incomeTax(125_140, 0, r), 37_700 * 0.2 + (125_140 - 37_700) * 0.4);
});

test("optimiser beats or matches the all-salary and all-dividend options", () => {
  for (const profit of [20_000, 60_000, 100_000, 180_000]) {
    const o = optimise(profit, 0, r);
    assert.ok(o.best);
    assert.ok(o.best.takeHome >= (o.allSalary?.takeHome ?? 0) - 0.01);
    assert.ok(o.best.takeHome >= (o.allDividends?.takeHome ?? 0) - 0.01);
    close(o.best.takeHome + o.best.totalTax, profit);
  }
});
