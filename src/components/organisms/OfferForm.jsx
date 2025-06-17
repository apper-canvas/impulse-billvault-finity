import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import FormField from '@/components/molecules/FormField'
import { offerService, categoryService } from '@/services'

const OfferForm = ({ offer, onSubmit, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    expirationDate: '',
    category: '',
    value: '',
    terms: ''
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
    if (offer) {
      setFormData({
        title: offer.title || '',
        code: offer.code || '',
        expirationDate: offer.expirationDate || '',
        category: offer.category || '',
        value: offer.value || '',
        terms: offer.terms || ''
      })
    } else {
      setFormData({
        title: '',
        code: '',
        expirationDate: '',
        category: '',
        value: '',
        terms: ''
      })
    }
    setErrors({})
  }, [offer, isOpen])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Offer title is required'
    }
    
    if (!formData.code.trim()) {
      newErrors.code = 'Coupon code is required'
    }
    
    if (!formData.expirationDate) {
      newErrors.expirationDate = 'Expiration date is required'
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }
    
    if (!formData.value.trim()) {
      newErrors.value = 'Offer value is required'
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
      let result
      if (offer) {
        result = await offerService.update(offer.Id, formData)
        toast.success('Offer updated successfully')
      } else {
        result = await offerService.create(formData)
        toast.success('Offer created successfully')
      }
      
      onSubmit?.(result)
    } catch (error) {
      toast.error(error.message || 'Failed to save offer')
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
                    {offer ? 'Edit Offer' : 'Add New Offer'}
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
                  label="Offer Title"
                  required
                  error={errors.title}
                >
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="block w-full px-3 py-2.5 text-sm text-surface-900 bg-white border border-surface-300 rounded-lg placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., 20% Off Next Purchase"
                  />
                </FormField>

                <FormField
                  label="Coupon Code"
                  required
                  error={errors.code}
                >
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                    className="block w-full px-3 py-2.5 text-sm text-surface-900 bg-white border border-surface-300 rounded-lg placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono"
                    placeholder="e.g., SAVE20NOW"
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
                  label="Offer Value"
                  required
                  error={errors.value}
                >
                  <input
                    type="text"
                    value={formData.value}
                    onChange={(e) => handleChange('value', e.target.value)}
                    className="block w-full px-3 py-2.5 text-sm text-surface-900 bg-white border border-surface-300 rounded-lg placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., 20%, $50, Free Shipping"
                  />
                </FormField>

                <FormField
                  label="Expiration Date"
                  required
                  error={errors.expirationDate}
                >
                  <input
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) => handleChange('expirationDate', e.target.value)}
                    className="block w-full px-3 py-2.5 text-sm text-surface-900 bg-white border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </FormField>

                <FormField
                  label="Terms & Conditions"
                >
                  <textarea
                    value={formData.terms}
                    onChange={(e) => handleChange('terms', e.target.value)}
                    rows={3}
                    className="block w-full px-3 py-2.5 text-sm text-surface-900 bg-white border border-surface-300 rounded-lg placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Terms and conditions for this offer..."
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
                    {offer ? 'Update Offer' : 'Create Offer'}
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

export default OfferForm