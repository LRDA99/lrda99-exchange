import { z } from "zod";

export const supportedAssets = ["BTC", "ETH", "SOL", "USDT", "USDC", "BNB", "TRX", "XRP", "LTC", "DOGE", "ADA", "POL", "AVAX", "BCH"] as const;
export const supportedFiats = ["NGN", "USD", "GBP", "EUR"] as const;

export const createOrderSchema = z.object({
  side: z.enum(["BUY", "SELL"]),
  asset: z.enum(supportedAssets),
  network: z.string().trim().min(2).max(80),
  fiat: z.enum(supportedFiats),
  inputAmount: z.number().positive().finite().max(1_000_000_000_000),
  estimatedOutput: z.number().nonnegative().finite().max(1_000_000_000_000),
  estimatedFee: z.number().nonnegative().finite().max(1_000_000_000),
  feeLabel: z.string().trim().min(1).max(20),
  walletAddress: z.string().trim().max(160).optional().or(z.literal("")),
  customerName: z.string().trim().min(2).max(100),
  customerEmail: z.string().trim().email().max(254).optional().or(z.literal("")),
  customerPhone: z.string().trim().regex(/^\+?[0-9]{10,15}$/),
  termsAccepted: z.literal(true),
  website: z.string().max(0).optional()
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
