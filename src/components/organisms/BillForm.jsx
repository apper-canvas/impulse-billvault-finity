import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import FormField from '@/components/molecules/FormField'
import { billService, categoryService } from '@/services'

const BillForm = ({ bill, onSubmit, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: '',
    dueDate: '',
    frequency: 'monthly',
    notes: ''
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAll()
        setCategories(data)
      } catch (error) {
        toast.error('Failed to load categories')
      }
    }
    loadCategories()
  }, [])

  useEffect(() => {
    if (bill) {
      setFormData({
        name: bill.name || '',
        amount: bill.amount?.toString() || '',
        category: bill.category || '',
        dueDate: bill.dueDate || '',
        frequency: bill.frequency || 'monthly',
        notes: bill.notes || ''
      })
    } else {
      setFormData({
        name: '',
        amount: '',
        category: '',
        dueDate: '',
        frequency: 'monthly',
        notes: ''
      })
    }
    setErrors({})
  }, [bill, isOpen])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Bill name is required'
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount'
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const billData = {
        ...formData,
        amount: parseFloat(formData.amount),
        isPaid: bill?.isPaid || false
      }

      let result
      if (bill) {
        result = await billService.update(bill.Id, billData)
        toast.success('Bill updated successfully')
      } else {
        result = await billService.create(billData)
        toast.success('Bill created successfully')
      }
      
      onSubmit?.(result)
    } catch (error) {
      toast.error(error.message || 'Failed to save bill')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-surface-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <Text variant="h4" weight="semibold">
                    {bill ? 'Edit Bill' : 'Add New Bill'}
                  </Text>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="X"
                    onClick={onCancel}
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <FormField
                  label="Bill Name"
                  required
                  error={errors.name}
                >
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="block w-full px-3 py-2.5 text-sm text-surface-900 bg-white border border-surface-300 rounded-lg placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Electricity Bill"
                  />
                </FormField>

                <FormField
                  label="Amount"
                  required
                  error={errors.amount}
                >
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => handleChange('amount', e.target.value)}
                    className="block w-full px-3 py-2.5 text-sm text-surface-900 bg-white border border-surface-300 rounded-lg placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0.00"
                  />
                </FormField>

                <FormField
                  label="Category"
                  required
                  error={errors.category}
                >
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="block w-full px-3 py-2.5 text-sm text-surface-900 bg-white border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.Id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField
                  label="Due Date"
                  required
                  error={errors.dueDate}
                >
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleChange('dueDate', e.target.value)}
                    className="block w-full px-3 py-2.5 text-sm text-surface-900 bg-white border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </FormField>

                <FormField
                  label="Frequency"
                  required
                >
                  <select
                    value={formData.frequency}
                    onChange={(e) => handleChange('frequency', e.target.value)}
                    className="block w-full px-3 py-2.5 text-sm text-surface-900 bg-white border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="one-time">One-time</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </FormField>

                <FormField
                  label="Notes"
                >
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    rows={3}
                    className="block w-full px-3 py-2.5 text-sm text-surface-900 bg-white border border-surface-300 rounded-lg placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Additional notes..."
                  />
                </FormField>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={loading}
                    icon="Save"
                  >
                    {bill ? 'Update Bill' : 'Create Bill'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default BillForm