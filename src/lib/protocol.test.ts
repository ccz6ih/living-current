import assert from "node:assert/strict";
import test from "node:test";
import {
  buildProtocol,
  calculateIndex,
  deriveElementGaps,
} from "./protocol.ts";

test("pulse ratings identify a low Earth and overactive Wood pattern", () => {
  const gaps = deriveElementGaps({ earth: 1, wood: 3 });
  assert.deepEqual(gaps, { earth: 1, wood: 1 });
  assert.equal(buildProtocol(gaps).title, "Support Earth");
});

test("protocol falls back to balancing when no Earth gap is present", () => {
  const plan = buildProtocol({ earth: 0, wood: 0 });
  assert.equal(plan.title, "Settle and balance");
  assert.equal(plan.points.length, 2);
});

test("index is bounded and averages the three measures", () => {
  assert.equal(calculateIndex({ settle: 75, pointSettle: 60, balance: 69 }), 68);
  assert.equal(calculateIndex({ settle: -5, pointSettle: 100, balance: 150 }), 67);
  assert.throws(
    () => calculateIndex({ settle: Number.NaN, pointSettle: 50, balance: 50 }),
    /finite/,
  );
});
