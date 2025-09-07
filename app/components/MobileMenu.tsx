"use client";

import { X } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
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
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl">
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
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
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
                  href="/about" 
                  className="block text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                  onClick={onClose}
                >
                  About
                </a>
              </li>

              <li>
                <a 
                  href="/hotels/toronto-downtown" 
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
            <a
              href="/search"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={onClose}
            >
              Search Hotels
            </a>
            <p className="text-sm text-gray-500 text-center mt-2">
              Compare direct rates in seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
