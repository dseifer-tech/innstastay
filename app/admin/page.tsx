'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Hotel {
  _id: string
  name: string
  slug: { current: string }
  description: string
  address: string
  rating: number
  hotelClass: number
  amenities: string[]
  tags: string[]
  city: string
  area: string
  bookingLinks?: Array<{
    name: string
    urlTemplate: string
    isActive: boolean
  }>
  primaryImage?: {
    url: string
    alt: string
  }
  primaryImageUrl?: string
  phone?: string
  seoTitle?: string
  seoDescription?: string
}

interface NewHotelForm {
  name: string
  slug: string
  description: string
  address: string
  rating: number
  hotelClass: number
  amenities: string
  tags: string
  city: string
  area: string
  phone: string
  seoTitle: string
  seoDescription: string
  primaryImageUrl: string
}

export default function AdminPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [deletingHotel, setDeletingHotel] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [addingHotel, setAddingHotel] = useState(false)
  const [newHotel, setNewHotel] = useState<NewHotelForm>({
    name: '',
    slug: '',
    description: '',
    address: '',
    rating: 0,
    hotelClass: 3,
    amenities: '',
    tags: '',
    city: '',
    area: '',
    phone: '',
    seoTitle: '',
    seoDescription: '',
    primaryImageUrl: ''
  })

  useEffect(() => {
    async function fetchHotels() {
      try {
        const response = await fetch('/api/admin/hotels')
        const data = await response.json()
        
        if (data.success) {
          setHotels(data.hotels)
        } else {
          throw new Error(data.error || 'Failed to fetch hotels')
        }
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch hotels')
        setLoading(false)
      }
    }

    fetchHotels()
  }, [])

  const handleEditHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel)
    setIsEditing(true)
  }

  const handleCloseEdit = () => {
    setSelectedHotel(null)
    setIsEditing(false)
  }

  const handleDeleteHotel = async (hotel: Hotel) => {
    const confirmed = window.confirm(
              `Are you sure you want to delete &quot;${hotel.name}&quot;? This action cannot be undone.`
    )
    
    if (!confirmed) return

    try {
      setDeletingHotel(hotel._id)
      
      const response = await fetch('/api/admin/hotels/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hotelId: hotel._id }),
      })

      const data = await response.json()

      if (data.success) {
        // Remove the hotel from the local state
        setHotels(hotels.filter(h => h._id !== hotel._id))
        alert(`Successfully deleted &quot;${hotel.name}&quot;`)
      } else {
        throw new Error(data.error || 'Failed to delete hotel')
      }
    } catch (err) {
      alert(`Error deleting hotel: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setDeletingHotel(null)
    }
  }

  const handleAddHotel = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setAddingHotel(true)
      
      const hotelData = {
        ...newHotel,
        amenities: newHotel.amenities.split(',').map(a => a.trim()).filter(Boolean),
        tags: newHotel.tags.split(',').map(t => t.trim()).filter(Boolean),
        rating: Number(newHotel.rating),
        hotelClass: Number(newHotel.hotelClass)
      }

      const response = await fetch('/api/admin/hotels/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hotelData),
      })

      const data = await response.json()

      if (data.success) {
        // Add the new hotel to the local state
        setHotels([...hotels, data.hotel])
        setShowAddForm(false)
        setNewHotel({
          name: '',
          slug: '',
          description: '',
          address: '',
          rating: 0,
          hotelClass: 3,
          amenities: '',
          tags: '',
          city: '',
          area: '',
          phone: '',
          seoTitle: '',
          seoDescription: '',
          primaryImageUrl: ''
        })
        alert(`Successfully added &quot;${hotelData.name}&quot;`)
      } else {
        throw new Error(data.error || 'Failed to add hotel')
      }
    } catch (err) {
      alert(`Error adding hotel: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setAddingHotel(false)
    }
  }

  const handleInputChange = (field: keyof NewHotelForm, value: string | number) => {
    setNewHotel(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Hotel Management</h1>
          <div className="text-center">Loading hotels from Sanity CMS...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Hotel Management</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Troubleshooting</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Check if Sanity project is accessible</li>
              <li>• Verify API token permissions</li>
              <li>• Ensure hotel data exists in Sanity</li>
              <li>• Try refreshing the page</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hotel Management</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Hotel
          </button>
        </div>
        
        {/* Add New Hotel Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Add New Hotel</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddHotel} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name *</label>
                  <input
                    type="text"
                    required
                    value={newHotel.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                  <input
                    type="text"
                    required
                    value={newHotel.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ace-hotel-toronto"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={newHotel.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                  <input
                    type="text"
                    value={newHotel.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Downtown"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <input
                    type="text"
                    required
                    value={newHotel.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={newHotel.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={newHotel.rating}
                    onChange={(e) => handleInputChange('rating', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Class (Stars)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newHotel.hotelClass}
                    onChange={(e) => handleInputChange('hotelClass', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={newHotel.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amenities (comma-separated)</label>
                  <input
                    type="text"
                    value={newHotel.amenities}
                    onChange={(e) => handleInputChange('amenities', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Free WiFi, Pool, Gym"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newHotel.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="luxury, downtown, business"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                  <input
                    type="text"
                    value={newHotel.seoTitle}
                    onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Image URL</label>
                  <input
                    type="url"
                    value={newHotel.primaryImageUrl}
                    onChange={(e) => handleInputChange('primaryImageUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
                <textarea
                  rows={2}
                  value={newHotel.seoDescription}
                  onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingHotel}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {addingHotel ? 'Adding...' : 'Add Hotel'}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {hotels.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">No hotels found in Sanity CMS.</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Hotels ({hotels.length})
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Manage your hotel listings from Sanity CMS
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hotel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amenities
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking Links
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {hotels.map((hotel) => (
                    <tr key={hotel._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {hotel.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {hotel.slug.current}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{hotel.city}</div>
                        <div className="text-sm text-gray-500">{hotel.area}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900">{hotel.rating} ★</span>
                          <span className="ml-2 text-sm text-gray-500">({hotel.hotelClass}★)</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {hotel.amenities?.slice(0, 3).map((amenity, index) => (
                            <span
                              key={`amenity-${hotel._id}-${amenity}-${index}`}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {amenity}
                            </span>
                          ))}
                          {hotel.amenities && hotel.amenities.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{hotel.amenities.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {hotel.bookingLinks?.map((link, index) => (
                            <span
                              key={`booking-${hotel._id}-${link.name}-${index}`}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                            >
                              {link.name}
                            </span>
                          ))}
                          {(!hotel.bookingLinks || hotel.bookingLinks.length === 0) && (
                            <span className="text-xs text-gray-500">No booking links</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {hotel.primaryImageUrl ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              Image URL
                            </span>
                          ) : hotel.primaryImage ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              Uploaded Image
                            </span>
                          ) : (
                            <span className="text-xs text-gray-500">No image</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditHotel(hotel)}
                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md text-xs"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleDeleteHotel(hotel)}
                            disabled={deletingHotel === hotel._id}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deletingHotel === hotel._id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Hotel Details Modal */}
        {isEditing && selectedHotel && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Hotel Details</h3>
                  <button
                    onClick={handleCloseEdit}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hotel Name</label>
                    <div className="mt-1 text-sm text-gray-900">{selectedHotel.name}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Slug</label>
                    <div className="mt-1 text-sm text-gray-900">{selectedHotel.slug.current}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <div className="mt-1 text-sm text-gray-900">{selectedHotel.description}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <div className="mt-1 text-sm text-gray-900">{selectedHotel.address}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Rating</label>
                      <div className="mt-1 text-sm text-gray-900">{selectedHotel.rating} ★</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Hotel Class</label>
                      <div className="mt-1 text-sm text-gray-900">{selectedHotel.hotelClass} ★</div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amenities</label>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedHotel.amenities?.map((amenity, index) => (
                        <span
                          key={`modal-amenity-${selectedHotel._id}-${amenity}-${index}`}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tags</label>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedHotel.tags?.map((tag, index) => (
                        <span
                          key={`modal-tag-${selectedHotel._id}-${tag}-${index}`}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Primary Image</label>
                    <div className="mt-1">
                      {selectedHotel.primaryImageUrl ? (
                        <div className="space-y-2">
                          <Image 
                            src={selectedHotel.primaryImageUrl} 
                            alt={`${selectedHotel.name} - Hotel in Toronto`}
                            width={128}
                            height={96}
                            className="w-32 h-24 object-cover rounded-md border"
                          />
                          <div className="text-xs text-gray-600">
                            <a href={selectedHotel.primaryImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                              View Full Image
                            </a>
                          </div>
                        </div>
                      ) : selectedHotel.primaryImage ? (
                        <div className="space-y-2">
                          <Image 
                            src={selectedHotel.primaryImage.url} 
                            alt={selectedHotel.primaryImage.alt}
                            width={128}
                            height={96}
                            className="w-32 h-24 object-cover rounded-md border"
                          />
                          <div className="text-xs text-gray-600">
                            <a href={selectedHotel.primaryImage.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                              View Full Image
                            </a>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No primary image</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => handleDeleteHotel(selectedHotel)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete Hotel
                  </button>
                  <button
                    onClick={handleCloseEdit}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Hotel Management System</h3>
          <p className="text-blue-800 text-sm mb-3">
            This interface shows all your hotel data from Sanity CMS. Click "View Details" to see complete information for each hotel.
          </p>
          <div className="text-blue-800 text-sm">
            <p><strong>Note:</strong> You can now delete hotels directly from this interface or:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><a href="/studio" className="text-blue-600 hover:text-blue-800 underline">Access the Sanity Studio</a></li>
              <li><a href="https://innstastay.sanity.studio/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Direct link to Sanity Studio</a></li>
              <li>Use the delete buttons in the table above</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
