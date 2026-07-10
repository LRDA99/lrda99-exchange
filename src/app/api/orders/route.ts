import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createOrderSchema } from "@/lib/order-schema";
import { createOrderReference } from "@/lib/reference";
import { allowRequest } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIp(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: NextRequest) {
  if (!allowRequest(clientIp(request))) return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });

  try {
    const body: unknown = await request.json();
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid order information", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    if (parsed.data.website) return NextResponse.json({ error: "Invalid submission" }, { status: 400 });

    const reference = createOrderReference();
    const order = await prisma.order.create({
      data: {
        reference,
        side: parsed.data.side,
        asset: parsed.data.asset,
        network: parsed.data.network,
        fiat: parsed.data.fiat,
        inputAmount: parsed.data.inputAmount,
        estimatedOutput: parsed.data.estimatedOutput,
        estimatedFee: parsed.data.estimatedFee,
        feeLabel: parsed.data.feeLabel,
        walletAddress: parsed.data.walletAddress || null,
        customerName: parsed.data.customerName,
        customerEmail: parsed.data.customerEmail || null,
        customerPhone: parsed.data.customerPhone,
        termsAcceptedAt: new Date(),
        events: { create: { type: "ORDER_REQUESTED", note: "Customer submitted a manual OTC quote request." } }
      },
      select: { reference: true, status: true, createdAt: true }
    });

    return NextResponse.json({ order }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Order creation failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Unable to create the order right now." }, { status: 500 });
  }
}
