import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Text from '@/components/atoms/Text'
import Button from '@/components/atoms/Button'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import EmptyState from '@/components/molecules/EmptyState'
import SearchBar from '@/components/molecules/SearchBar'
import BillCard from '@/components/organisms/BillCard'
import BillForm from '@/components/organisms/BillForm'
import { billService } from '@/services'

const Bills = () => {
  const [bills, setBills] = useState([])
  const [filteredBills, setFilteredBills] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingBill, setEditingBill] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    loadBills()
  }, [])

  useEffect(() => {
    filterBills()
  }, [bills, searchQuery, categoryFilter])

  const loadBills = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await billService.getAll()
      setBills(data || [])
    } catch (err) {
      setError(err.message || 'Failed to load bills')
      toast.error('Failed to load bills')
    } finally {
      setLoading(false)
    }
  }

  const filterBills = () => {
    let filtered = [...bills]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(bill =>
        bill.name.toLowerCase().includes(query) ||
        bill.category.toLowerCase().includes(query) ||
        bill.notes?.toLowerCase().includes(query)
      )
    }

    if (categoryFilter) {
      filtered = filtered.filter(bill => bill.category === categoryFilter)
    }

    setFilteredBills(filtered)
  }

  const handleCreateBill = () => {
    setEditingBill(null)
    setShowForm(true)
  }

  const handleEditBill = (bill) => {
    setEditingBill(bill)
    setShowForm(true)
  }

  const handleDeleteBill = async (bill) => {
    if (!confirm(`Are you sure you want to delete "${bill.name}"?`)) {
      return
    }

    try {
      await billService.delete(bill.Id)
      setBills(prev => prev.filter(b => b.Id !== bill.Id))
      toast.success('Bill deleted successfully')
    } catch (error) {
      toast.error(error.message || 'Failed to delete bill')
    }
  }

  const handleMarkPaid = async (bill) => {
    try {
      const updatedBill = await billService.markPaid(bill.Id)
      setBills(prev => prev.map(b => b.Id === bill.Id ? updatedBill : b))
      toast.success('Bill marked as paid')
    } catch (error) {
      toast.error(error.message || 'Failed to update bill')
    }
  }

  const handleFormSubmit = (bill) => {
    if (editingBill) {
      setBills(prev => prev.map(b => b.Id === bill.Id ? bill : b))
    } else {
      setBills(prev => [bill, ...prev])
    }
    setShowForm(false)
    setEditingBill(null)
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingBill(null)
  }

  const getCategories = () => {
    const categories = [...new Set(bills.map(bill => bill.category))]
    return categories.sort()
  }

  if (loading) {
    return (
      <div className="p-6 max-w-full overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Text variant="h2" weight="bold" className="mb-2">
              Bills
            </Text>
            <Text color="muted">
              Manage your bills and payment schedules
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
          onRetry={loadBills}
        />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <Text variant="h2" weight="bold" className="mb-2">
            Bills
          </Text>
          <Text color="muted">
            Manage your bills and payment schedules
          </Text>
        </div>
        <Button
          icon="Plus"
          onClick={handleCreateBill}
          className="mt-4 sm:mt-0"
        >
          Add Bill
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            placeholder="Search bills..."
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

      {/* Bills Grid */}
      {filteredBills.length === 0 && bills.length > 0 ? (
        <EmptyState
          icon="Search"
          title="No bills found"
          description="Try adjusting your search or filter criteria"
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('')
            setCategoryFilter('')
          }}
        />
      ) : filteredBills.length === 0 ? (
        <EmptyState
          icon="Receipt"
          title="No bills yet"
          description="Add your first bill to start tracking your payments and never miss a due date."
          actionLabel="Add Bill"
          onAction={handleCreateBill}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBills.map((bill, index) => (
            <motion.div
              key={bill.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <BillCard
                bill={bill}
                onEdit={handleEditBill}
                onDelete={handleDeleteBill}
                onMarkPaid={handleMarkPaid}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Bill Form Modal */}
      <BillForm
        bill={editingBill}
        isOpen={showForm}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    </div>
  )
}

export default Bills