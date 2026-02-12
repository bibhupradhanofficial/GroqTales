import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { getCreatorTransactions } from '@/lib/royalty-service';

/**
 * GET /api/royalties/transactions/[wallet]?page=1&limit=10&status=completed
 * Fetch paginated royalty transaction history for a creator.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { wallet: string } }
) {
  try {
    await dbConnect();

    const { wallet } = params;

    if (!wallet) {
      return NextResponse.json(
        { success: false, error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // SECURITY WARNING: Header-based wallet verification is NOT secure for production.
    // The x-wallet-address header can be spoofed by any client.
    // TODO: Implement proper wallet ownership verification using one of:
    //   1. Signed message verification (personal_sign + ecrecover)
    //   2. Session/JWT tokens issued after wallet signature verification
    //   3. Server-side session tied to authenticated wallet
    // For now, this provides basic access control for internal/demo use only.
    const requestingWallet = request.headers.get('x-wallet-address')?.toLowerCase();
    const internalKey = request.headers.get('x-internal-api-key');
    const expectedKey = process.env.INTERNAL_API_KEY;

    // Allow access if: internal API key matches OR requesting wallet matches params wallet
    const isInternalCall = expectedKey && internalKey === expectedKey;
    const isOwner = requestingWallet === wallet.toLowerCase();

    if (!isInternalCall && !isOwner) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - wallet mismatch or missing credentials' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const status = searchParams.get('status') as
      | 'pending'
      | 'completed'
      | 'failed'
      | null;

    // Validate status if provided
    if (status && !['pending', 'completed', 'failed'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be pending, completed, or failed' },
        { status: 400 }
      );
    }

    const result = await getCreatorTransactions(wallet, {
      page,
      limit,
      status: status || undefined,
    });

    return NextResponse.json(
      {
        success: true,
        transactions: result.transactions,
        pagination: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
          limit: result.limit,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching royalty transactions:', error);

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
