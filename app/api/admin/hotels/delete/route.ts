import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity.client';
import { log } from '@/lib/core/log';

export async function DELETE(req: NextRequest) {
  try {
    const { hotelId } = await req.json();
    if (!hotelId) {
      return NextResponse.json({ error: 'Hotel ID is required' }, { status: 400 });
    }
    log.admin.info('Deleting hotel:', hotelId);
    await sanityClient.delete(hotelId);
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
