import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import FormField from '@/components/molecules/FormField'
import FileUpload from '@/components/molecules/FileUpload'
import { warrantyService, categoryService } from '@/services'
const WarrantyForm = ({ warranty, onSubmit, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    purchaseDate: '',
    expirationDate: '',
    vendor: '',
    serialNumber: '',
    notes: ''
notes: '',
    images: []
  })
  const [categories, setCategories] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState([])
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
    if (warranty) {
      setFormData({
        productName: warranty.productName || '',
        category: warranty.category || '',
        purchaseDate: warranty.purchaseDate || '',
        expirationDate: warranty.expirationDate || '',
        vendor: warranty.vendor || '',
serialNumber: warranty.serialNumber || '',
        notes: warranty.notes || '',
        images: warranty.images || []
      })
      setUploadedFiles(warranty.images || [])
    } else {
      setFormData({
        productName: '',
        category: '',
        purchaseDate: '',
        expirationDate: '',
        vendor: '',
serialNumber: '',
        notes: '',
        images: []
      })
      setUploadedFiles([])
    }
    setErrors({})
  }, [warranty, isOpen])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.productName.trim()) {
      newErrors.productName = 'Product name is required'
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }
    
    if (!formData.purchaseDate) {
      newErrors.purchaseDate = 'Purchase date is required'
    }
    
    if (!formData.expirationDate) {
      newErrors.expirationDate = 'Expiration date is required'
    }

    if (formData.purchaseDate && formData.expirationDate) {
      const purchaseDate = new Date(formData.purchaseDate)
      const expirationDate = new Date(formData.expirationDate)
      if (expirationDate <= purchaseDate) {
        newErrors.expirationDate = 'Expiration date must be after purchase date'
      }
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
      // Include uploaded files in form data
      const submitData = { ...formData, images: uploadedFiles }
      
      let result
      if (warranty) {
        result = await warrantyService.update(warranty.Id, submitData)
        toast.success('Warranty updated successfully')
toast.success('Warranty updated successfully')
      } else {
        result = await warrantyService.create(submitData)
        toast.success('Warranty created successfully')
      }
      onSubmit?.(result)
    } catch (error) {
      toast.error(error.message || 'Failed to save warranty')
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

  const handleFilesChange = (files) => {
    setUploadedFiles(files)
    setFormData(prev => ({ ...prev, images: files }))
  }

  const clearFiles = () => {
    setUploadedFiles([])
    setFormData(prev => ({ ...prev, images: [] }))
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
                    {warranty ? 'Edit Warranty' : 'Add New Warranty'}
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
                  label="Product Name"
                  required
                  error={errors.productName}
                >
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => handleChange('productName', e.target.value)}
                    className="block w-full px-3 py-2.5 text-sm text-surface-900 bg-white border border-surface-300 rounded-lg placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., MacBook Pro 14-inch"
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
                  label="Purchase Date"
                  required
                  error={errors.purchaseDate}
                >
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => handleChange('purchaseDate', e.target.value)}
                    className="block w-full px-3 py-2.5 text-sm text-surface-900 bg-white border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  label="Vendor"
                  error={errors.vendor}
                >
                  <input
                    type="text"
                    value={formData.vendor}
                    onChange={(e) => handleChange('vendor', e.target.value)}
                    className="block w-full px-3 py-2.5 text-sm text-surface-900 bg-white border border-surface-300 rounded-lg placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Apple Inc."
                  />
                </FormField>

                <FormField
                  label="Serial Number"
                  error={errors.serialNumber}
                >
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => handleChange('serialNumber', e.target.value)}
                    className="block w-full px-3 py-2.5 text-sm text-surface-900 bg-white border border-surface-300 rounded-lg placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono"
                    placeholder="e.g., C02XK1ABMD6T"
                  />
                </FormField>

                <FormField
                  label="Notes"
                >
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    rows={3}
                    className="block w-full px-3 py-2.5 text-sm text-surface-900 bg-white border border-surface-300 rounded-lg placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Additional notes about the warranty..."
                  />
/>
                </FormField>

                <FormField
                  label="Warranty Cards & Receipts"
                  description="Upload images of warranty cards, receipts, or other related documents"
                >
                  <FileUpload
                    files={uploadedFiles}
                    onFilesChange={handleFilesChange}
                    maxFiles={5}
                    maxSize={5 * 1024 * 1024} // 5MB
                  />
                </FormField>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
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
                    {warranty ? 'Update Warranty' : 'Create Warranty'}
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

export default WarrantyForm