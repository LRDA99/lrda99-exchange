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
test("doubles the sell fee at every tier", () => {
  assert.deepEqual(feeForUsd(5, "sell"), { kind: "fixed", value: 2, label: "$2" });
  assert.deepEqual(feeForUsd(7, "sell"), { kind: "rate", value: 0.3, label: "30%" });
  assert.ok(Math.abs(calculateFeeUsd(7, "sell") - 2.1) < Number.EPSILON * 10);
  assert.equal(calculateFeeUsd(100, "sell"), 30);
});
