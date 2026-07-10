export type FeeTier = { kind: "fixed" | "rate"; value: number; label: string };

export function feeForUsd(orderUsd: number): FeeTier {
  if (!Number.isFinite(orderUsd) || orderUsd < 0) throw new Error("Order value must be a non-negative number");
  if (orderUsd <= 5) return { kind: "fixed", value: 1, label: "$1" };
  return { kind: "rate", value: 0.15, label: "15%" };
}

export function calculateFeeUsd(orderUsd: number) {
  const tier = feeForUsd(orderUsd);
  return tier.kind === "fixed" ? tier.value : orderUsd * tier.value;
}
