import { NextResponse } from 'next/server';
import { getHotelsForSearch } from '@/lib/hotelSource';
import { log } from '@/lib/core/log';

export async function GET() {
  try {
    const hotels = await getHotelsForSearch();
    
    return NextResponse.json({
      success: true,
      hotels: hotels,
      count: hotels.length
    });
  } catch (error) {
    log.hotel.error('Error fetching hotels:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
