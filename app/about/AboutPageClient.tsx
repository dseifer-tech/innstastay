'use client';

import { useState } from 'react';
import { Search, Shield, DollarSign, CheckCircle, Building, Users, Eye, Link, Heart, Zap, TrendingDown, TrendingUp } from 'lucide-react';
import MobileMenu from '@/app/components/MobileMenu';
import SecondaryCTA from '@/app/components/SecondaryCTA';

export default function AboutPageClient() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef5ff] to-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About InnstaStay
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We&apos;re revolutionizing hotel booking by connecting travelers directly with hotels, eliminating middlemen and their fees.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At InnstaStay, we believe that hotel booking should be transparent, fair, and commission-free. We&apos;re building a platform that puts travelers and hotels first, not third-party booking sites.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                By connecting you directly with verified hotels in downtown Toronto, we ensure you get the best rates while supporting local businesses.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">No booking fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Direct hotel rates</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-6 text-center">
                    <Building className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Verified Hotels</h3>
                    <p className="text-sm text-gray-600">All properties are carefully vetted</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 text-center">
                    <Users className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Happy Travelers</h3>
                    <p className="text-sm text-gray-600">Thousands of satisfied customers</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 text-center">
                    <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Best Rates</h3>
                    <p className="text-sm text-gray-600">Direct pricing from hotels</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 text-center">
                    <Shield className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Secure Booking</h3>
                    <p className="text-sm text-gray-600">Safe and reliable transactions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How InnstaStay Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our simple three-step process puts you in control of your hotel booking.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Search</h3>
              <p className="text-gray-600 leading-relaxed">
                Enter your travel dates and preferences to find available hotels in downtown Toronto.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Compare</h3>
              <p className="text-gray-600 leading-relaxed">
                View real-time rates directly from hotels with no markups or hidden fees.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Link className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Book Direct</h3>
              <p className="text-gray-600 leading-relaxed">
                Click through to the hotel&apos;s official website to complete your booking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Choose InnstaStay?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We&apos;re different from traditional booking platforms in every way that matters.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingDown className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">No Commissions</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We don&apos;t take a cut from hotels, so they can offer you better rates.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Better Rates</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Direct booking often means lower prices and better availability.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Loyalty Benefits</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Earn points and perks when booking directly with hotel chains.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Instant Booking</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                No waiting for confirmations - book directly with the hotel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary CTA */}
      <SecondaryCTA />

      {/* FAQ Section - About-specific */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about booking direct with InnstaStay.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How is InnstaStay different from other booking sites?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Unlike traditional booking sites that charge hotels 15-25% commission (which gets passed to you), 
                we show you direct hotel rates with zero markup. You see the hotel&apos;s actual price and book directly with them.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Do I actually save money booking direct?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Yes! Hotels often offer their best rates directly to avoid paying commissions to booking sites. 
                Plus, you&apos;ll earn loyalty points and get better cancellation policies when booking direct.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How do you make money if you don&apos;t charge commissions?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We partner with select hotels who appreciate our commission-free approach. 
                Some pay us a small marketing fee, but this never affects the rates you see - they&apos;re always the hotel&apos;s direct price.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What if I need to cancel or change my booking?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Since you book directly with the hotel, you&apos;ll follow their cancellation policy - 
                which is often more flexible than third-party sites. You&apos;ll also get direct customer service from the hotel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Compare Toronto Hotels */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to save on your Toronto stay?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands who&apos;ve ditched the booking sites and discovered the benefits of booking direct.
          </p>
          <a 
            href="/search" 
            className="inline-block bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Compare Toronto Hotels →
          </a>
        </div>
      </section>

      {/* AboutPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About InnstaStay",
            "description": "Learn how InnstaStay eliminates middlemen to provide direct hotel booking in Toronto. No commissions, no markups, just the hotel&apos;s actual price.",
            "url": "https://www.innstastay.com/about",
            "mainEntity": {
              "@type": "Organization",
              "name": "InnstaStay",
              "description": "Commission-free hotel booking platform connecting travelers directly with verified hotels in downtown Toronto."
            }
          })
        }}
      />

      {/* Mobile Menu */}
      <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
    </div>
  );
}
