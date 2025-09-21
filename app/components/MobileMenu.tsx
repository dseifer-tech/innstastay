"use client";

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import OptimizedImage from './OptimizedImage';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap and keyboard handling
  useEffect(() => {
    if (!isOpen) return;

    // Focus the close button when menu opens
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const menuElement = menuRef.current;
        if (!menuElement) return;

        const focusableElements = menuElement.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          // Shift + Tab (backward)
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab (forward)
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Set inert on body content
    const bodyChildren = Array.from(document.body.children).filter(
      child => child !== menuRef.current?.parentElement
    );
    bodyChildren.forEach(child => {
      (child as HTMLElement).setAttribute('inert', '');
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Remove inert from body content
      bodyChildren.forEach(child => {
        (child as HTMLElement).removeAttribute('inert');
      });
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
        }}
        role="button"
        tabIndex={0}
        aria-label="Close menu"
      />
      
      {/* Menu Panel */}
      <div ref={menuRef} className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex flex-col items-center">
                             <OptimizedImage
                 src="/innstastay-logo.svg"
                 alt="InnstaStay Logo"
                 width={48}
                 height={48}
                 className="h-12 w-auto"
               />
              <span className="text-xs text-blue-600 tracking-wide mt-1">Commission-Free Booking</span>
            </div>
            <Button ref={closeButtonRef} variant="ghost" size="sm" aria-label="Close menu" className="rounded-full p-2" onClick={onClose}>
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-6">
            <ul className="space-y-6">
              <li>
                <a 
                  href="/" 
                  className="block text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                  onClick={onClose}
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="/#about" 
                  className="block text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                  onClick={onClose}
                >
                  About
                </a>
              </li>

              <li>
                <a 
                  href="/downtown-toronto" 
                  className="block text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                  onClick={onClose}
                >
                  Downtown Hotels
                </a>
              </li>
              <li>
                <a 
                  href="/contact" 
                  className="block text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                  onClick={onClose}
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          {/* CTA Section */}
          <div className="p-6 border-t border-gray-100">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              className="shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={() => {
                window.location.href = '/search';
                onClose();
              }}
            >
              Search Hotels
            </Button>
            <p className="text-sm text-gray-500 text-center mt-2">
              Compare direct rates in seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
