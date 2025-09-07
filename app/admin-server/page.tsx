'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { log } from '@/lib/core/log'

interface HotelOption {
  name: string
  property_token: string
}

interface SerpApiHotel {
  name: string
  rating?: number
  hotel_class?: number
  address?: string
  phone?: string
  website?: string
  property_token?: string
  thumbnail?: string
  amenities?: string[]
  description?: string
  latitude?: number
  longitude?: number
  // Additional CMS fields
  city?: string
  area?: string
  seoTitle?: string
  seoDescription?: string
  tags?: string[]
  isActive?: boolean
  bookingLinks?: Array<{ name: string; urlTemplate: string; isActive: boolean }>
  primaryImageUrl?: string
}

interface RawSerpApiData {
  [key: string]: any
}

export default function AdminServerPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [hotelOptions, setHotelOptions] = useState<HotelOption[]>([])
  const [selectedHotel, setSelectedHotel] = useState<SerpApiHotel | null>(null)
  const [searching, setSearching] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [importing, setImporting] = useState(false)
  const [searchDates, setSearchDates] = useState<string | {checkIn: string, checkOut: string} | null>(null)
  const [rawData, setRawData] = useState<RawSerpApiData | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [editedHotel, setEditedHotel] = useState<SerpApiHotel | null>(null)

  const searchHotels = async () => {
    if (!searchQuery.trim()) return

    setSearching(true)
    setHotelOptions([])
    setSelectedHotel(null)
    try {
      const response = await fetch('/api/admin/hotels/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      })

      const data = await response.json()
      
      if (data.success) {
        setHotelOptions(data.hotelOptions || [])
        setSearchDates(data.searchDates || '')
        setRawData(data.rawData || null)
      } else {
        log.admin.error('Search failed:', data.error)
        setHotelOptions([])
      }
    } catch (error) {
      log.admin.error('Error searching hotels:', error)
      setHotelOptions([])
    } finally {
      setSearching(false)
    }
  }

  const getHotelDetails = async (property_token: string) => {
    setLoadingDetails(true)
    try {
      const response = await fetch('/api/admin/hotels/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          property_token,
          originalQuery: searchQuery 
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setSelectedHotel(data.hotel)
        setRawData(data.rawData || null)
      } else {
        log.admin.error('Failed to get hotel details:', data.error)
        alert(`Failed to get hotel details: ${data.error}`)
      }
    } catch (error) {
      log.admin.error('Error getting hotel details:', error)
      alert(`Error getting hotel details: ${error}`)
    } finally {
      setLoadingDetails(false)
    }
  }

  const openPreview = (hotel: SerpApiHotel) => {
    setEditedHotel({ ...hotel })
    setShowPreview(true)
  }

  const closePreview = () => {
    setShowPreview(false)
    setEditedHotel(null)
  }

  const updateEditedHotel = (field: keyof SerpApiHotel, value: any) => {
    if (editedHotel) {
      setEditedHotel({ ...editedHotel, [field]: value })
    }
  }

  // Filter out pricing data from raw JSON for cleaner display
  const getFilteredRawData = () => {
    if (!rawData) return null
    
    const filtered = { ...rawData }
    
    // Remove pricing-related fields
    delete filtered.prices
    delete filtered.featured_prices
    delete filtered.rate_per_night
    delete filtered.total_rate
    
    return filtered
  }

  const importHotel = async (hotel: SerpApiHotel) => {
    setImporting(true)
    try {
      const response = await fetch('/api/admin/hotels/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hotel }),
      })

      const data = await response.json()
      
      if (data.success) {
        alert(`Successfully imported "${hotel.name}"!`)
        // Reset the state
        setSelectedHotel(null)
        setHotelOptions([])
        setSearchQuery('')
        closePreview()
      } else {
        alert(`Failed to import "${hotel.name}": ${data.error}`)
      }
    } catch (error) {
      log.admin.error('Error importing hotel:', error)
      alert(`Error importing "${hotel.name}": ${error}`)
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Add New Hotels</h1>
      
      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Search for Hotels</h2>
        
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for hotels (e.g., 'The Kimpton Saint George Toronto')"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && searchHotels()}
          />
          <button
            onClick={searchHotels}
            disabled={searching || !searchQuery.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {searchDates && (
          <p className="text-sm text-gray-600 mb-4">
            Search dates: {typeof searchDates === 'string' ? searchDates : `${searchDates.checkIn} to ${searchDates.checkOut}`}
          </p>
        )}
      </div>

      {/* Hotel Options List */}
      {hotelOptions.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Select a Hotel ({hotelOptions.length} found)</h2>
          
          <div className="space-y-2">
            {hotelOptions.map((option, index) => (
              <div key={option.property_token} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <span className="font-medium">{option.name}</span>
                <button
                  onClick={() => getHotelDetails(option.property_token)}
                  disabled={loadingDetails}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingDetails ? 'Loading...' : 'Select'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Hotel Details */}
      {selectedHotel && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Hotel Details</h2>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{selectedHotel.name}</h3>
                {selectedHotel.address && (
                  <p className="text-gray-600 text-sm">{selectedHotel.address}</p>
                )}
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  {selectedHotel.rating && <span>Rating: {selectedHotel.rating}/5</span>}
                  {selectedHotel.hotel_class && <span>Class: {selectedHotel.hotel_class}★</span>}
                  {selectedHotel.phone && <span>Phone: {selectedHotel.phone}</span>}
                </div>
                {selectedHotel.description && (
                  <p className="text-gray-700 mt-2 text-sm">{selectedHotel.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openPreview(selectedHotel)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Preview & Edit
                </button>
                <button
                  onClick={() => importHotel(selectedHotel)}
                  disabled={importing}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {importing ? 'Importing...' : 'Import'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {hotelOptions.length === 0 && !searching && searchQuery && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">No hotels found. Try a different search term.</p>
        </div>
      )}

      {/* Preview & Edit Modal */}
      {showPreview && editedHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Preview & Edit Hotel Data</h2>
                <button
                  onClick={closePreview}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Edit Form */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Edit Hotel Data</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
                      <input
                        type="text"
                        value={editedHotel.name || ''}
                        onChange={(e) => updateEditedHotel('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          value={editedHotel.city || ''}
                          onChange={(e) => updateEditedHotel('city', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Area/Neighborhood</label>
                        <input
                          type="text"
                          value={editedHotel.area || ''}
                          onChange={(e) => updateEditedHotel('area', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        value={editedHotel.address || ''}
                        onChange={(e) => updateEditedHotel('address', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={editedHotel.rating || ''}
                          onChange={(e) => updateEditedHotel('rating', parseFloat(e.target.value) || undefined)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Class (Stars)</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={editedHotel.hotel_class || ''}
                          onChange={(e) => updateEditedHotel('hotel_class', parseInt(e.target.value) || undefined)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="text"
                        value={editedHotel.phone || ''}
                        onChange={(e) => updateEditedHotel('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                      <input
                        type="url"
                        value={editedHotel.website || ''}
                        onChange={(e) => updateEditedHotel('website', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Primary Image URL</label>
                      <input
                        type="url"
                        value={editedHotel.primaryImageUrl || ''}
                        onChange={(e) => updateEditedHotel('primaryImageUrl', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com/image.jpg"
                      />
                      <p className="text-xs text-gray-500 mt-1">URL for the main hotel image</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
                      <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-3">
                        {[
                          'Free WiFi', 'Restaurant', 'Fitness Center', 'Pool', 'Spa', 
                          'Business Center', 'Kitchen', 'Free Breakfast', 'Bar', 
                          'Concierge', 'Kids Club', 'Art Gallery', 'Historic Building', 
                          'Downtown Location', 'Boutique Hotel', 'Parking', 'Room Service',
                          'Laundry Service', 'Air Conditioning', 'Pet Friendly'
                        ].map((amenity) => (
                          <label key={amenity} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={editedHotel.amenities?.includes(amenity) || false}
                              onChange={(e) => {
                                const currentAmenities = editedHotel.amenities || []
                                const newAmenities = e.target.checked
                                  ? [...currentAmenities, amenity]
                                  : currentAmenities.filter(a => a !== amenity)
                                updateEditedHotel('amenities', newAmenities)
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm">{amenity}</span>
                          </label>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Select all applicable amenities</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={editedHotel.description || ''}
                        onChange={(e) => updateEditedHotel('description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                        <input
                          type="number"
                          step="any"
                          value={editedHotel.latitude || ''}
                          onChange={(e) => updateEditedHotel('latitude', parseFloat(e.target.value) || undefined)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                        <input
                          type="number"
                          step="any"
                          value={editedHotel.longitude || ''}
                          onChange={(e) => updateEditedHotel('longitude', parseFloat(e.target.value) || undefined)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                      <input
                        type="text"
                        value={editedHotel.seoTitle || ''}
                        onChange={(e) => updateEditedHotel('seoTitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
                      <textarea
                        value={editedHotel.seoDescription || ''}
                        onChange={(e) => updateEditedHotel('seoDescription', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                      <select
                        multiple
                        value={editedHotel.tags || []}
                        onChange={(e) => {
                          const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                          updateEditedHotel('tags', selectedOptions);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="extended_stay">Extended Stay</option>
                        <option value="boutique">Boutique</option>
                        <option value="family_friendly">Family Friendly</option>
                        <option value="luxury">Luxury</option>
                        <option value="business">Business</option>
                        <option value="entertainment_district">Entertainment District</option>
                        <option value="financial_district">Financial District</option>
                        <option value="yorkville">Yorkville</option>
                        <option value="downtown">Downtown</option>
                        <option value="historic">Historic</option>
                        <option value="pool">Pool</option>
                        <option value="artistic">Artistic</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple tags</p>
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editedHotel.isActive !== false}
                          onChange={(e) => updateEditedHotel('isActive', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Active (visible on site)</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Raw Data Preview */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Raw SerpAPI Data</h3>
                  <div className="bg-gray-100 p-4 rounded-md max-h-[70vh] overflow-y-auto border border-gray-300">
                    <pre className="text-xs text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {rawData ? JSON.stringify(getFilteredRawData(), null, 2) : 'No raw data available'}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
                <button
                  onClick={closePreview}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => importHotel(editedHotel)}
                  disabled={importing}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {importing ? 'Importing...' : 'Import with Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
