import { NextResponse } from 'next/server'
import { getAllHotels } from '@/lib/sanity'

export async function GET() {
  try {
    const hotels = await getAllHotels()
    
    return NextResponse.json({
      success: true,
      count: hotels.length,
      hotels: hotels
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
