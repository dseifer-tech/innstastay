'use client';

import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import OptimizedImage from './OptimizedImage';
import MobileMenu from './MobileMenu';

type MenuItem = { label: string; href?: string; external?: boolean; ref?: { _type: string; slug?: { current: string } } }

export default function Navigation() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mainMenu, setMainMenu] = useState<MenuItem[]>([]);

  useEffect(() => {
    // Non-blocking fetch; renders fallback links if CMS not available
    fetch('/api/navigation').then(r => r.json()).then((data) => {
      if (data?.mainMenu) setMainMenu(data.mainMenu)
    }).catch(() => {})
  }, [])

  const fallback = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Downtown Hotels', href: '/downtown-toronto' },
    { label: 'Contact', href: '/contact' }
  ]
  const items = (mainMenu.length ? mainMenu : fallback) as Array<MenuItem & { href?: string; external?: boolean }>

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <a href="/" className="flex flex-col items-center">
                <OptimizedImage
                  src="/innstastay-logo.svg"
                  alt="InnstaStay Logo"
                  width={100}
                  height={80}
                  className="h-12 sm:h-16 md:h-20 w-auto block"
                  priority={true}
                />
                <span className="text-xs text-blue-600 tracking-wide mt-1">Commission-Free Booking</span>
              </a>
              <div className="hidden md:flex items-center space-x-8">
                <ul className="flex space-x-8 text-md font-medium text-neutral-700">
                  {items.map((it, i) => (
                    <li key={`nav-${i}`}>
                      <a href={(it as any).href || '#'} target={(it as any).external ? '_blank' : undefined} rel={(it as any).external ? 'noopener noreferrer' : undefined} className="hover:border-b-2 border-blue-600 pb-1 transition-colors duration-200">
                        {it.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  onClick={() => window.location.href = '/search'}
                >
                  Compare Rates
                </Button>
              </div>
              <div className="md:hidden">
                <Button variant="ghost" size="sm" aria-label="Open menu" className="p-2" onClick={() => setShowMobileMenu(!showMobileMenu)}>
                  <Menu className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
    </>
  );
}
