import { NextRequest, NextResponse } from 'next/server';
import { log } from '@/lib/core/log';

export const runtime = 'nodejs';

export async function DELETE(req: NextRequest) {
  try {
    const { hotelId } = await req.json();
    if (!hotelId) {
      return NextResponse.json({ error: 'Hotel ID is required' }, { status: 400 });
    }
    log.admin.info('Deleting hotel:', hotelId);
    
    // Use the new guarded Sanity client
    const { getClient } = await import('@/lib/cms/sanityClient');
    const client = await getClient();
    
    // Check if it's the no-op client
    if (process.env.SKIP_SANITY === '1') {
      log.admin.info('SKIP_SANITY=1, hotel delete skipped:', hotelId);
      return NextResponse.json({
        success: true,
        message: 'Hotel delete skipped (SKIP_SANITY=1)'
      });
    }
    
    // For real Sanity client, we need to cast it and call delete properly
    await (client as any).delete(hotelId);
    
    log.admin.info('Successfully deleted hotel:', hotelId);
    return NextResponse.json({
      success: true,
      message: 'Hotel deleted successfully'
    });
  } catch (error) {
    log.admin.error('Error deleting hotel:', error);
    return NextResponse.json({
      error: 'Failed to delete hotel'
    }, { status: 500 });
  }
}
