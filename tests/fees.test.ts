import test from "node:test";
import assert from "node:assert/strict";
import { calculateFeeUsd, feeForUsd } from "../src/lib/fees";

test("applies the fixed fee below $25", () => assert.deepEqual(feeForUsd(24.99), { kind: "fixed", value: 3, label: "$3" }));
test("applies the $5 fee from $25 to below $75", () => assert.equal(calculateFeeUsd(25), 5));
test("applies 8.5% from $75 through $200", () => {
  assert.ok(Math.abs(calculateFeeUsd(75) - 6.375) < Number.EPSILON * 10);
  assert.equal(calculateFeeUsd(200), 17);
});
test("applies 10% above $200", () => assert.equal(calculateFeeUsd(201), 20.1));
