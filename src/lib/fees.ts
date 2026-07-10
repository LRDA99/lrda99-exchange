export type FeeTier = { kind: "fixed" | "rate"; value: number; label: string };

export function feeForUsd(orderUsd: number, side: "buy" | "sell" = "buy"): FeeTier {
  if (!Number.isFinite(orderUsd) || orderUsd < 0) throw new Error("Order value must be a non-negative number");
  const multiplier = side === "sell" ? 2 : 1;
  if (orderUsd <= 5) {
    const value = multiplier;
    return { kind: "fixed", value, label: `$${value}` };
  }
  const value = 0.15 * multiplier;
  return { kind: "rate", value, label: `${value * 100}%` };
}

export function calculateFeeUsd(orderUsd: number, side: "buy" | "sell" = "buy") {
  const tier = feeForUsd(orderUsd, side);
  return tier.kind === "fixed" ? tier.value : orderUsd * tier.value;
}
