import test from "node:test";
import assert from "node:assert/strict";
import { calculateFeeUsd, feeForUsd } from "../src/lib/fees";

test("applies the fixed $1 fee at or below $5", () => {
  assert.deepEqual(feeForUsd(5), { kind: "fixed", value: 1, label: "$1" });
  assert.equal(calculateFeeUsd(4), 1);
});
test("applies 15% above $5", () => {
  assert.deepEqual(feeForUsd(5.01), { kind: "rate", value: 0.15, label: "15%" });
  assert.ok(Math.abs(calculateFeeUsd(7) - 1.05) < Number.EPSILON * 10);
  assert.equal(calculateFeeUsd(100), 15);
});
