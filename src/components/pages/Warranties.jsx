import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Text from '@/components/atoms/Text'
import Button from '@/components/atoms/Button'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import EmptyState from '@/components/molecules/EmptyState'
import SearchBar from '@/components/molecules/SearchBar'
import WarrantyCard from '@/components/organisms/WarrantyCard'
import WarrantyForm from '@/components/organisms/WarrantyForm'
import { warrantyService } from '@/services'

const Warranties = () => {
  const [warranties, setWarranties] = useState([])
  const [filteredWarranties, setFilteredWarranties] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingWarranty, setEditingWarranty] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    loadWarranties()
  }, [])

  useEffect(() => {
    filterWarranties()
  }, [warranties, searchQuery, categoryFilter])

  const loadWarranties = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await warrantyService.getAll()
      setWarranties(data || [])
    } catch (err) {
      setError(err.message || 'Failed to load warranties')
      toast.error('Failed to load warranties')
    } finally {
      setLoading(false)
    }
  }

  const filterWarranties = () => {
    let filtered = [...warranties]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(warranty =>
        warranty.productName.toLowerCase().includes(query) ||
        warranty.category.toLowerCase().includes(query) ||
        warranty.vendor.toLowerCase().includes(query) ||
        warranty.serialNumber?.toLowerCase().includes(query) ||
        warranty.notes?.toLowerCase().includes(query)
      )
    }

    if (categoryFilter) {
      filtered = filtered.filter(warranty => warranty.category === categoryFilter)
    }

    // Sort by expiration date (closest first)
    filtered.sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate))

    setFilteredWarranties(filtered)
  }

  const handleCreateWarranty = () => {
    setEditingWarranty(null)
    setShowForm(true)
  }

  const handleEditWarranty = (warranty) => {
    setEditingWarranty(warranty)
    setShowForm(true)
  }

  const handleDeleteWarranty = async (warranty) => {
    if (!confirm(`Are you sure you want to delete the warranty for "${warranty.productName}"?`)) {
      return
    }

    try {
      await warrantyService.delete(warranty.Id)
      setWarranties(prev => prev.filter(w => w.Id !== warranty.Id))
      toast.success('Warranty deleted successfully')
    } catch (error) {
      toast.error(error.message || 'Failed to delete warranty')
    }
  }

  const handleFormSubmit = (warranty) => {
    if (editingWarranty) {
      setWarranties(prev => prev.map(w => w.Id === warranty.Id ? warranty : w))
    } else {
      setWarranties(prev => [warranty, ...prev])
    }
    setShowForm(false)
    setEditingWarranty(null)
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingWarranty(null)
  }

  const getCategories = () => {
    const categories = [...new Set(warranties.map(warranty => warranty.category))]
    return categories.sort()
  }

  if (loading) {
    return (
      <div className="p-6 max-w-full overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Text variant="h2" weight="bold" className="mb-2">
              Warranties
            </Text>
            <Text color="muted">
              Track your product warranties and expiration dates
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
          onRetry={loadWarranties}
        />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <Text variant="h2" weight="bold" className="mb-2">
            Warranties
          </Text>
          <Text color="muted">
            Track your product warranties and expiration dates
          </Text>
        </div>
        <Button
          icon="Plus"
          onClick={handleCreateWarranty}
          className="mt-4 sm:mt-0"
        >
          Add Warranty
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            placeholder="Search warranties..."
            onSearch={setSearchQuery}
          />
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

      {/* Warranties Grid */}
      {filteredWarranties.length === 0 && warranties.length > 0 ? (
        <EmptyState
          icon="Search"
          title="No warranties found"
          description="Try adjusting your search or filter criteria"
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('')
            setCategoryFilter('')
          }}
        />
      ) : filteredWarranties.length === 0 ? (
        <EmptyState
          icon="Shield"
          title="No warranties yet"
          description="Add your first warranty to track expiration dates and never lose important product information."
          actionLabel="Add Warranty"
          onAction={handleCreateWarranty}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWarranties.map((warranty, index) => (
            <motion.div
              key={warranty.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <WarrantyCard
                warranty={warranty}
                onEdit={handleEditWarranty}
                onDelete={handleDeleteWarranty}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Warranty Form Modal */}
      <WarrantyForm
        warranty={editingWarranty}
        isOpen={showForm}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    </div>
  )
}

export default Warranties