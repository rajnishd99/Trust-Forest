import { NextResponse } from "next/server";

type SubmitClaimBody = {
  planter?: string;
  photoUri?: string;
  gridCell?: string;
  stakeStroops?: number;
};

export async function POST(request: Request) {
  const body = (await request.json()) as SubmitClaimBody;
  const contractId = process.env.NEXT_PUBLIC_CONTRACT_ID ?? process.env.CONTRACT_ID;

  if (!contractId) {
    return NextResponse.json({ error: "Contract ID is not configured." }, { status: 500 });
  }

  if (!body.photoUri || !body.gridCell || !body.stakeStroops || body.stakeStroops <= 0) {
    return NextResponse.json(
      { error: "Photo URI, grid cell, and positive stake are required." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    contractId,
    method: "submit_claim",
    args: {
      planter: body.planter ?? "wallet_address_required",
      photo_uri: body.photoUri,
      grid_cell: body.gridCell,
      stake: body.stakeStroops,
    },
    signing: "Wallet signature required because submit_claim calls planter.require_auth().",
  });
}
