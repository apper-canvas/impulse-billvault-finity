import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Text from '@/components/atoms/Text'
import Button from '@/components/atoms/Button'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import EmptyState from '@/components/molecules/EmptyState'
import CategoryCard from '@/components/organisms/CategoryCard'
import { categoryService, billService, warrantyService, offerService } from '@/services'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [itemCounts, setItemCounts] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      const [categoriesData, billsData, warrantiesData, offersData] = await Promise.all([
        categoryService.getAll(),
        billService.getAll(),
        warrantyService.getAll(),
        offerService.getAll()
      ])

      setCategories(categoriesData || [])

      // Calculate item counts for each category
      const counts = {}
      categoriesData?.forEach(category => {
        const billCount = billsData?.filter(bill => bill.category === category.name).length || 0
        const warrantyCount = warrantiesData?.filter(warranty => warranty.category === category.name).length || 0
        const offerCount = offersData?.filter(offer => offer.category === category.name).length || 0
        counts[category.name] = billCount + warrantyCount + offerCount
      })
      setItemCounts(counts)
    } catch (err) {
      setError(err.message || 'Failed to load categories')
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategory = async (category) => {
    const itemCount = itemCounts[category.name] || 0
    if (itemCount > 0) {
      toast.error(`Cannot delete category "${category.name}" because it has ${itemCount} items. Please reassign or delete those items first.`)
      return
    }

    if (!confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      return
    }

    try {
      await categoryService.delete(category.Id)
      setCategories(prev => prev.filter(c => c.Id !== category.Id))
      toast.success('Category deleted successfully')
    } catch (error) {
      toast.error(error.message || 'Failed to delete category')
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-full overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Text variant="h2" weight="bold" className="mb-2">
              Categories
            </Text>
            <Text color="muted">
              Organize your bills, warranties, and offers
            </Text>
          </div>
        </div>
        <SkeletonLoader count={6} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          message={error}
          onRetry={loadCategories}
        />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <Text variant="h2" weight="bold" className="mb-2">
            Categories
          </Text>
          <Text color="muted">
            Organize your bills, warranties, and offers
          </Text>
        </div>
      </div>

      {/* Category Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 rounded-lg p-4"
        >
          <Text variant="h3" weight="bold" color="primary" className="mb-1">
            {categories.length}
          </Text>
          <Text variant="small" color="muted">
            Total Categories
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-green-100 rounded-lg p-4"
        >
          <Text variant="h3" weight="bold" className="mb-1 text-green-600">
            {Object.values(itemCounts).reduce((sum, count) => sum + count, 0)}
          </Text>
          <Text variant="small" color="muted">
            Total Items
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-amber-100 rounded-lg p-4"
        >
          <Text variant="h3" weight="bold" className="mb-1 text-amber-600">
            {categories.filter(cat => (itemCounts[cat.name] || 0) > 0).length}
          </Text>
          <Text variant="small" color="muted">
            Categories Used
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-100 rounded-lg p-4"
        >
          <Text variant="h3" weight="bold" className="mb-1 text-blue-600">
            {Math.max(...Object.values(itemCounts), 0)}
          </Text>
          <Text variant="small" color="muted">
            Most Used Category
          </Text>
        </motion.div>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <EmptyState
          icon="Tag"
          title="No categories found"
          description="Categories help organize your bills, warranties, and offers. The system comes with default categories to get you started."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories
            .sort((a, b) => (itemCounts[b.name] || 0) - (itemCounts[a.name] || 0))
            .map((category, index) => (
              <motion.div
                key={category.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CategoryCard
                  category={category}
                  itemCount={itemCounts[category.name] || 0}
                  onDelete={handleDeleteCategory}
                />
              </motion.div>
            ))}
        </div>
      )}

      {/* Help Text */}
      <div className="mt-8 p-4 bg-surface-50 rounded-lg">
        <Text variant="small" color="muted">
          <strong>Categories help you organize your items:</strong> When you add bills, warranties, or offers, you can assign them to categories for better organization and filtering. Categories with items cannot be deleted until all items are reassigned or removed.
        </Text>
      </div>
    </div>
  )
}

export default Categories