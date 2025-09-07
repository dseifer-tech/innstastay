import { NextResponse } from 'next/server'
import { getNavigation } from '@/lib/cms/navigation'

export async function GET() {
  try {
    const nav = await getNavigation()
    return NextResponse.json(nav || { mainMenu: [], footerMenu: [] })
  } catch {
    return NextResponse.json({ mainMenu: [], footerMenu: [] })
  }
}


