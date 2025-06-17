import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Text from '@/components/atoms/Text'
import Button from '@/components/atoms/Button'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import EmptyState from '@/components/molecules/EmptyState'
import SearchBar from '@/components/molecules/SearchBar'
import OfferCard from '@/components/organisms/OfferCard'
import OfferForm from '@/components/organisms/OfferForm'
import { offerService } from '@/services'

const Offers = () => {
  const [offers, setOffers] = useState([])
  const [filteredOffers, setFilteredOffers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingOffer, setEditingOffer] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('active')

  useEffect(() => {
    loadOffers()
  }, [])

  useEffect(() => {
    filterOffers()
  }, [offers, searchQuery, categoryFilter, statusFilter])

  const loadOffers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await offerService.getAll()
      setOffers(data || [])
    } catch (err) {
      setError(err.message || 'Failed to load offers')
      toast.error('Failed to load offers')
    } finally {
      setLoading(false)
    }
  }

  const filterOffers = () => {
    let filtered = [...offers]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(offer =>
        offer.title.toLowerCase().includes(query) ||
        offer.code.toLowerCase().includes(query) ||
        offer.category.toLowerCase().includes(query) ||
        offer.value.toLowerCase().includes(query) ||
        offer.terms?.toLowerCase().includes(query)
      )
    }

    if (categoryFilter) {
      filtered = filtered.filter(offer => offer.category === categoryFilter)
    }

    const today = new Date()
    if (statusFilter === 'active') {
      filtered = filtered.filter(offer => new Date(offer.expirationDate) >= today)
    } else if (statusFilter === 'expired') {
      filtered = filtered.filter(offer => new Date(offer.expirationDate) < today)
    }

    // Sort by expiration date (closest first)
    filtered.sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate))

    setFilteredOffers(filtered)
  }

  const handleCreateOffer = () => {
    setEditingOffer(null)
    setShowForm(true)
  }

  const handleEditOffer = (offer) => {
    setEditingOffer(offer)
    setShowForm(true)
  }

  const handleDeleteOffer = async (offer) => {
    if (!confirm(`Are you sure you want to delete "${offer.title}"?`)) {
      return
    }

    try {
      await offerService.delete(offer.Id)
      setOffers(prev => prev.filter(o => o.Id !== offer.Id))
      toast.success('Offer deleted successfully')
    } catch (error) {
      toast.error(error.message || 'Failed to delete offer')
    }
  }

  const handleFormSubmit = (offer) => {
    if (editingOffer) {
      setOffers(prev => prev.map(o => o.Id === offer.Id ? offer : o))
    } else {
      setOffers(prev => [offer, ...prev])
    }
    setShowForm(false)
    setEditingOffer(null)
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingOffer(null)
  }

  const getCategories = () => {
    const categories = [...new Set(offers.map(offer => offer.category))]
    return categories.sort()
  }

  if (loading) {
    return (
      <div className="p-6 max-w-full overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Text variant="h2" weight="bold" className="mb-2">
              Offers & Coupons
            </Text>
            <Text color="muted">
              Manage your coupons and promotional offers
            </Text>
          </div>
        </div>
        <SkeletonLoader count={4} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          message={error}
          onRetry={loadOffers}
        />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <Text variant="h2" weight="bold" className="mb-2">
            Offers & Coupons
          </Text>
          <Text color="muted">
            Manage your coupons and promotional offers
          </Text>
        </div>
        <Button
          icon="Plus"
          onClick={handleCreateOffer}
          className="mt-4 sm:mt-0"
        >
          Add Offer
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            placeholder="Search offers..."
            onSearch={setSearchQuery}
          />
        </div>
        <div className="w-full sm:w-32">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full px-3 py-2.5 text-sm text-surface-900 bg-white border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
        </div>
        <div className="w-full sm:w-48">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="block w-full px-3 py-2.5 text-sm text-surface-900 bg-white border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Categories</option>
            {getCategories().map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Offers Grid */}
      {filteredOffers.length === 0 && offers.length > 0 ? (
        <EmptyState
          icon="Search"
          title="No offers found"
          description="Try adjusting your search or filter criteria"
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('')
            setCategoryFilter('')
            setStatusFilter('active')
          }}
        />
      ) : filteredOffers.length === 0 ? (
        <EmptyState
          icon="Gift"
          title="No offers yet"
          description="Add your first coupon or promotional offer to start saving money on your purchases."
          actionLabel="Add Offer"
          onAction={handleCreateOffer}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer, index) => (
            <motion.div
              key={offer.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <OfferCard
                offer={offer}
                onEdit={handleEditOffer}
                onDelete={handleDeleteOffer}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Offer Form Modal */}
      <OfferForm
        offer={editingOffer}
        isOpen={showForm}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    </div>
  )
}

export default Offers