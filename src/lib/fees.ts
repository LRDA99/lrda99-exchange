export type FeeTier = { kind: "fixed" | "rate"; value: number; label: string };

export function feeForUsd(orderUsd: number): FeeTier {
  if (!Number.isFinite(orderUsd) || orderUsd < 0) throw new Error("Order value must be a non-negative number");
  if (orderUsd < 25) return { kind: "fixed", value: 3, label: "$3" };
  if (orderUsd < 75) return { kind: "fixed", value: 5, label: "$5" };
  if (orderUsd <= 200) return { kind: "rate", value: 0.085, label: "8.5%" };
  return { kind: "rate", value: 0.1, label: "10%" };
}

export function calculateFeeUsd(orderUsd: number) {
  const tier = feeForUsd(orderUsd);
  return tier.kind === "fixed" ? tier.value : orderUsd * tier.value;
}
