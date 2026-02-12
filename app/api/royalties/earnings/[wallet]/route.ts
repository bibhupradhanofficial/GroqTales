import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { getCreatorEarnings } from '@/lib/royalty-service';

/**
 * GET /api/royalties/earnings/[wallet]
 * Fetch earnings summary for a creator by wallet address.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { wallet: string } }
) {
  try {
    await dbConnect();

    const { wallet } = params;

    // TODO: Add wallet ownership verification once auth is implemented.
    // Currently any caller can fetch earnings for any wallet address.
    // Should verify that the authenticated user owns the requested wallet.

    if (!wallet) {
      return NextResponse.json(
        { success: false, error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const earnings = await getCreatorEarnings(wallet);

    return NextResponse.json({ success: true, earnings }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching creator earnings:', error);

    if (error.message?.includes('Invalid wallet')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
