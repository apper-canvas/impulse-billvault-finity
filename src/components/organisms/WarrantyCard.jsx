import { motion } from 'framer-motion'
import { format, differenceInDays } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Text from '@/components/atoms/Text'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'

const WarrantyCard = ({ warranty, onEdit, onDelete, onView }) => {
  const expirationDate = new Date(warranty.expirationDate)
  const today = new Date()
  const daysUntilExpiration = differenceInDays(expirationDate, today)
  
  const getExpirationStatus = () => {
    if (daysUntilExpiration < 0) return { text: 'Expired', variant: 'error' }
    if (daysUntilExpiration <= 7) return { text: `${daysUntilExpiration} days left`, variant: 'error' }
    if (daysUntilExpiration <= 30) return { text: `${daysUntilExpiration} days left`, variant: 'warning' }
    return { text: `${daysUntilExpiration} days left`, variant: 'success' }
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'Electronics': 'Smartphone',
      'Jewelry': 'Gem',
      'Appliances': 'Refrigerator',
      'Furniture': 'Armchair',
      'Automotive': 'Car',
      'Tools': 'Wrench'
    }
    return icons[category] || 'Package'
  }

  const status = getExpirationStatus()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card hover className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${daysUntilExpiration <= 7 ? 'bg-red-100' : 'bg-primary/10'}`}>
              <ApperIcon 
                name={getCategoryIcon(warranty.category)} 
                className={`w-5 h-5 ${daysUntilExpiration <= 7 ? 'text-red-600' : 'text-primary'}`} 
              />
            </div>
            <div>
              <Text variant="h5" weight="semibold" className="mb-1">
                {warranty.productName}
              </Text>
              <Text variant="small" color="muted">
                {warranty.category}
              </Text>
            </div>
          </div>
          
          <Badge variant={status.variant}>
            {status.text}
          </Badge>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <Text color="muted">Vendor</Text>
            <Text variant="small" weight="medium">
              {warranty.vendor}
            </Text>
          </div>
          
          <div className="flex justify-between items-center">
            <Text color="muted">Purchase Date</Text>
            <Text variant="small">
              {format(new Date(warranty.purchaseDate), 'MMM dd, yyyy')}
            </Text>
          </div>
          
          <div className="flex justify-between items-center">
            <Text color="muted">Expires</Text>
            <Text variant="small" weight="medium">
              {format(expirationDate, 'MMM dd, yyyy')}
            </Text>
          </div>

          {warranty.serialNumber && (
            <div className="flex justify-between items-center">
              <Text color="muted">Serial Number</Text>
              <Text variant="small" className="font-mono">
                {warranty.serialNumber}
              </Text>
            </div>
          )}
        </div>

        {warranty.notes && (
          <div className="mb-4 p-3 bg-surface-50 rounded-lg">
            <Text variant="small" color="muted">
              {warranty.notes}
            </Text>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-surface-100">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              icon="Eye"
              onClick={() => onView?.(warranty)}
            />
            <Button
              variant="ghost"
              size="sm"
              icon="Edit"
              onClick={() => onEdit?.(warranty)}
            />
            <Button
              variant="ghost"
              size="sm"
              icon="Trash2"
              onClick={() => onDelete?.(warranty)}
            />
          </div>
          
          {daysUntilExpiration <= 30 && daysUntilExpiration > 0 && (
            <div className="flex items-center text-amber-600">
              <ApperIcon name="AlertTriangle" className="w-4 h-4 mr-1" />
              <Text variant="xs" weight="medium">
                Expiring Soon
              </Text>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

export default WarrantyCard