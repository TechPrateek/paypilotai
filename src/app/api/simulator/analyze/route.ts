import { NextRequest, NextResponse } from "next/server";
import { analyzeTransaction } from "@/engine/risk-engine";
import { simulatorInputSchema } from "@/lib/validators";
import { TransactionInput } from "@/engine/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = simulatorInputSchema.parse(body);

    const transactionInput: TransactionInput = {
      amount: Number(validatedData.amount),
      currency: validatedData.currency,
      paymentMethod: validatedData.paymentMethod,
      country: validatedData.country,
      isNewDevice: validatedData.isNewDevice,
      customerId: "sim_customer",
      customerEmail: validatedData.customerEmail,
      accountAgeDays: validatedData.accountAgeDays,
      previousFailedAttempts: validatedData.previousFailedAttempts,
      transactionsInLast5Min: validatedData.transactionsInLast5Min,
      transactionsInLast1Hour: (validatedData.transactionsInLast5Min || 0) * 3,
      customerAverageAmount: 5000,
      customerTotalTransactions: 50,
      customerCountries: ["IN"],
      customerDeviceCount: 1,
      isDisposableEmail: validatedData.isDisposableEmail,
      isProxyIp: false,
      isVpnIp: false,
      isSuspiciousIp: validatedData.isSuspiciousIp,
      previousDisputes: 0,
    };

    const result = analyzeTransaction(transactionInput);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in simulator:", error);
    return NextResponse.json(
      { error: "Simulation failed", details: error },
      { status: 400 }
    );
  }
}
