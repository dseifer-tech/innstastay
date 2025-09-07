import Link from 'next/link';
import { Search, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef5ff] to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back to finding great hotel deals!
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Link>
          
          <Link 
            href="/search"
            className="inline-flex items-center justify-center w-full bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
          >
            <Search className="w-5 h-5 mr-2" />
            Search Hotels
          </Link>
          
          <Link 
            href="/"
            className="inline-flex items-center justify-center w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Link>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Popular pages:</p>
          <div className="flex flex-wrap justify-center gap-2">

            <span className="text-gray-300">•</span>
            <Link href="/about" className="text-blue-600 hover:text-blue-700 text-sm">
              About Us
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/hotels/town-inn-suites" className="text-blue-600 hover:text-blue-700 text-sm">
              Town Inn Suites
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
